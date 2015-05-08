###########################################################################################################################
# This file contains the server side logic for my automated math question tagging web application
# This project is being completed as my final project for CISC 6376 Software Design Pattern in Spring 2015
# Professor Dr. Zhou Ji
# @author Luigi Patruno
# @date 6 May 2015
###########################################################################################################################

from flask import Flask, request, render_template, jsonify
import numpy as np
import pandas as pd
from sklearn.externals import joblib

app = Flask(__name__)

def find_all(a_str, sub):
    """
    Find all instances of a subtring within a string
    """
    start = 0
    while True:
        start = a_str.find(sub, start)
        if start == -1: return
        yield start
        start += len(sub)

def extract_latex( question ):
    """
    Return latex expressions found within the question text.
    """
    latex = []
    latex_indices = list( find_all( question, '$$') )
    
    for i in range( 0, len(latex_indices), 2 ):
        latex.append( question[latex_indices[i]+2:latex_indices[i+1]] )
        
    return latex
    
       
def extract_keywords( question ):
    """
    Return any keywords found within the question text.
    """
    tag_info = pd.read_csv('data/keywords.csv', index_col=0)
    
    
    question_tokens = question.lower().split()
    question_tokens = {token:0 for token in question_tokens}
    
    keywords_found_in_text = []
    
    for keyword in tag_info['keyword'].values:

        keyword_tokens = keyword.split()
        question_contains_tokens = []
        
        for token in keyword_tokens:
            if token in question_tokens:
                question_contains_tokens.append(True)
            else:
                question_contains_tokens.append(False)

        if all(vals == True for vals in question_contains_tokens):
            keywords_found_in_text.append(keyword)
            
    return keywords_found_in_text


def binarize_keywords(n, indices):
    """
    Given a list of keyword indices, returns numpy array of 
    binarized features where binarized[i] == 1 if i in indices.
    """
    binarized = [0 for i in range(n)]

    for i in indices:
        binarized[i] = 1

    return binarized
        
            
def keyword_features( question ):
    """
    Given question text, return binarized feature vector for keywords found within the text.
    """
    tag_info = pd.read_csv('data/tag_info.csv', index_col=0)
    keywords = tag_info['keyword'].values.tolist()
    keywords = {k: keywords.index(k) for k in keywords}
    
    keywords_found = extract_keywords( question )
    keyword_features = []
    
    for k in keywords_found:
        if k in keywords:
            keyword_features.append( keywords[k] )
            
    keyword_features = binarize_keywords( tag_info.shape[0], keyword_features)
            
    return keyword_features
    

def binarize_latex(n, indices):
    """
    Given a list of LaTeX indices, returns numpy array of 
    binarized features where binarized[i] == 1 if i in indices.
    """
    binarized = [0 for i in range(n)]

    for i in indices:
        binarized[i] = 1

    return binarized

    
def latex_features( question ):
    """
    Given question text, return binarized feature vector for latex found within the text.
    """
    token_info = pd.read_csv('data/token_info.csv', index_col=0)    
    latex_features = []        
    
    latex = extract_latex( question )
    latex = ' '.join( latex ).split()

    for l in latex:
        if l in token_info.token.values:
             latex_features.append( token_info[ token_info['token'] == l ].index[0]  )
             
    latex_features = binarize_latex(token_info.shape[0], latex_features)
             
    return latex_features
    

def extract_features( question ):
    """
    Given question text, this function extracts and returns the feature vector to be fed into the Linear SVC classifier 
    """
    k_features = keyword_features( question )
    l_features = latex_features( question )
    
    features = k_features + l_features
    
    return np.array( features )
    

def predict( features ):
    """
    Given the feature set for a particular question, this function loads the pre-built
    classifier and predicts the tags for the question
    """
    # Load the classifier
    clf = joblib.load('data/model_pickle/model.pkl')
    y_pred = clf.predict( features )
    
    return y_pred
    
def get_tags( indices ):
    """
    Given the vector tag representation of the prediction from the 
    """
    tag_info = pd.read_csv('data/tag_info.csv', index_col=0)
    indices = [x[0] for x in indices.nonzero()]
    tags = []
    
    for i in indices:
        tags.append( tag_info.iloc[i].keyword )
    
    return tags
    

@app.route('/')
@app.route('/index')
def index():
    """
    Method to display the MathTag index page
    """
    return render_template('index.html')
    

# TODO run the question text through the classifier
# TODO return the predicted tags
@app.route('/tagQuestion', methods=['POST'])   
def tag_question():
    """
    Accept question text from the user, tag the question, and return the recommended tags
    """ 
    # Retrieve the question text from from request object
    question = request.form['question']
    features = extract_features( question )
    
    if sum(features) > 0:
        tags = get_tags( predict( features ) )
    else:
        tags = ['No features']
    
    return render_template('predict.html', question=question, tags=tags)
    

# TODO Save the data
@app.route('/saveTags', methods=['POST'])
def save_tags():
    """
    Save the question text and the predicted tags
    """
    question = request.form['question']
    tags = request.form.getlist('tags[]')
    
    return render_template('input.html')
    
    
@app.route('/cancel')    
def cancel():
    """
    Reject the predicted tags and return the question input UI
    """
    return render_template('input.html')
    
    
if __name__ == '__main__':
    # Production mode
    #port = int(os.environ.get("PORT", 5000))
    #app.run(host='0.0.0.0', port=port)
    
    # Testing mode
    app.run(host='0.0.0.0', debug=True)
