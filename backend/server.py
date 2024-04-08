from flask import Flask,request,jsonify, send_file
from pose_estimation_main import generate_final_video
import spacy
import os
# Note:
# eg."didnt you do that": you that do not   ====>  as 'not' came before the verb (in last), last was not empty and so verb got appended to first
# To be done : adj-noun => noun-adj
def glossify(text):
  POS = ['ADJ',	'ADP','PUNCT','ADV','AUX','SYM','INTJ','CCONJ','NOUN','DET','PROPN','NUM','VERB','PART','PRON','SCONJ']
  wh =['what','where','who','when','how','which','whom','why','whose']
  time=['yesterday','today','tommorrow']
  remov=['AUX','DET','PUNCT','ADP','CCONJ','SCONJ']
  last=[]
  first=[]
  nlp = spacy.load("en_core_web_sm")
  lemmatizer = nlp.get_pipe("lemmatizer")
  doc = nlp(text)
  for token in doc:

    # Moving wh-words to the end
    if token.lemma_ in wh:
      last.append(token.lemma_)

    # For negative sentences not comes last (before wh-word if present)
    elif token.lemma_ == 'not':
      last.insert(0,token.lemma_)

    # Moving time words to the beginning
    elif token.lemma_ in time:
      first.insert(0,token.lemma_)

    # Removing auxiliary, determiner ,punctuation, adposition, coordinating conjunction, subordinating conjunction
    elif token.pos_ in remov:
      continue

  # if wh word present, put verb before wh word
    elif token.pos_=='VERB':
      if last:
        # if 'not' + verb => verb + 'not' (even if wh is present or not)
        if last[0]=='not':
          last.insert(0,token.lemma_)
          continue
        # if wh-word in last, verb comes before it
        first.append(token.lemma_)
      else:
        last.append(token.lemma_)

    else:
      # for every other word (eg. noun, pronoun etc.)
      first.append(token.lemma_)

  first+=last
  # print([(token.lemma_,token.pos_,token.dep_) for token in doc])
  return (" ".join(first).title()) # title case for webscraping

 
app = Flask(__name__)
 

@app.route('/process', methods=['POST'])
def process_sentence():
    data = request.json
    sentence = data['sentence']
    processed_sentence = glossify(sentence) 
    video_path = generate_final_video(processed_sentence)
    return jsonify({'videoPath': video_path, 'gloss': processed_sentence })

@app.route('/videos/<filename>')
def serve_video(filename):
    videos_path = os.path.join(os.path.dirname(__file__), '..', 'videos',filename)
    return send_file(videos_path, mimetype='video/mp4')



if __name__ == '__main__':
    app.run(debug=True)