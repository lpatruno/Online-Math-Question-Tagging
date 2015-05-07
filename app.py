###########################################################################################################################
# This file contains the server side logic for my automated math question tagging web application
# This project is being completed as my final project for CISC 6376 Software Design Pattern in Spring 2015
# Professor Dr. Zhou Ji
# @author Luigi Patruno
# @date 6 May 2015
###########################################################################################################################

from flask import Flask, request, render_template, jsonify

app = Flask(__name__)


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
    
    tags = ['tag1', 'tag2']
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
