import os
from flask import Flask,request,jsonify, send_file
from pose_estimation_main import generate_final_video
from text_to_gloss import glossify

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