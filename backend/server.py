import os
from flask import Flask, request, jsonify, send_file
from util import pose_estimation_main, text_to_gloss
# from backend.util import pose_estimation_main, text_to_gloss # for testing

app = Flask(__name__)
 
# Define the path to the CSV file for storing feedback
FEEDBACK_CSV_FILE = 'feedback.csv'

# Ensure the CSV file exists at the beginning of the program execution
if not os.path.isfile(FEEDBACK_CSV_FILE):
    with open(FEEDBACK_CSV_FILE, 'w') as f:
        f.write('Sentence,Gloss,Feedback\n')


def clear_words_pose_folder(folder_path):
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")

# Clear the contents of the folder at the beginning of the program execution
clear_words_pose_folder("./videos/words_pose")
clear_words_pose_folder("./videos")

@app.route('/process', methods=['POST'])
def process_sentence():
    data = request.json
    sentence = data['sentence']
    processed_sentence = text_to_gloss.glossify(sentence) 
    if processed_sentence:
        video_path = pose_estimation_main.generate_final_video(processed_sentence)
    else:  video_path = ""
    return jsonify({'videoPath': video_path, 'gloss': processed_sentence })

@app.route('/videos/<filename>')
def serve_video(filename):
    videos_path = os.path.join(os.path.dirname(__file__), '..', 'videos', filename)
    return send_file(videos_path, mimetype='video/mp4')

@app.route('/saveFeedback', methods=['POST'])
def save_feedback():
    data = request.json
    sentence = data['sentence']
    gloss = data['gloss']
    feedback = data['feedback']

    with open(FEEDBACK_CSV_FILE, 'a') as f:
        f.write(f'{sentence},{gloss},{feedback}\n')
    print("Feedback saved successfully")
    return jsonify({'message': 'Feedback saved successfully'})


if __name__ == '__main__':
    app.run(debug=True)