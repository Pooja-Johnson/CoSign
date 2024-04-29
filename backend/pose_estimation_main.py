import cv2
import mediapipe as mp
import numpy as np
from bs4 import BeautifulSoup
import requests
from pytube import YouTube
import os, copy
import langid

def extract_video_url(html_content, search_word):
    soup = BeautifulSoup(html_content, 'html.parser')
    # Find all divs with class 'col-md-6'
    divs = soup.find_all('div', class_='col-md-6')
    for div in divs:
        # Find the <h5> tag within the div
        category_tag = div.find('h5')
        if category_tag and 'रोज़मर्रा/Everyday' in category_tag.text:
            # Find the first video iframe within the target div
            video_iframe = div.find('iframe')
            if video_iframe:
                h4_tag = div.find('h4')
                h4_text = h4_tag.text.strip()
                
                words = h4_text.split()
                print(words)
                # Check each word for language and match with the search word
                for word in words:
                    print(word + " : " + langid.classify(word)[0])
                    if langid.classify(word)[0] == "en":  # Assuming "en" is the language code for English
                        if word == search_word:
                            return video_iframe['src']
                        else:
                          break
    return None

def get_video_url(search_word):
    url = "https://divyangjan.depwd.gov.in/islrtc/search.php"
    search_response = requests.post(url, data={'search': search_word, 'submit': 'Search'})
    video_url = extract_video_url(search_response.content,search_word)
    return video_url


def download_youtube_video(video_url, output_path):

    try:
        yt = YouTube(video_url)
        stream = yt.streams.get_highest_resolution()
        downloaded_file_path = stream.download(output_path)
        filename = os.path.basename(downloaded_file_path)
        print("Video downloaded successfully. Filename:", filename)
        return filename
    
    except Exception as e:
        print("Error:", str(e))
        return None

def generate_pose_video(word):

    video_url = get_video_url(word)
    if not video_url:
        print("Video URL not found for word:", word)
        return None
    downloaded_video_path = download_youtube_video(video_url, './videos')
    if not downloaded_video_path:
        print("Failed to download video for word:", word)
        return None
    
    ## If no video found (proper noun etc) => Fingerspelling

    # Read the downloaded video
    cap = cv2.VideoCapture("./videos/" + downloaded_video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    output_path = "./videos/words_pose/" + word + ".mp4"
    fourcc = cv2.VideoWriter_fourcc(*'avc1') # avc1 to avoid codex error change to 'mp4v' if not needed
    out = cv2.VideoWriter(output_path, fourcc, fps, (width ,height))

    # Initialize MediaPipe Holistic model
    mp_holistic = mp.solutions.holistic
    mp_drawing_styles = mp.solutions.drawing_styles

    all_pose_info = []
    normalized_pose_info = [] 
    all_center_x=[]
    all_center_y=[]
    all_black_image=[]

    # Process the video frame by frame
    with mp_holistic.Holistic(min_detection_confidence=0.9, min_tracking_confidence=0.9, smooth_landmarks=True, refine_face_landmarks=True) as holistic:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            black_image = np.zeros_like(frame)
            all_black_image.append(black_image)

            results = holistic.process(image=frame)
            all_pose_info.append(results)

            # Calculate the center coordinates of each pose frame
            total_x = 0
            total_y = 0
            num_landmarks = 0
            if results.pose_landmarks:
                for landmark in results.pose_landmarks.landmark:
                    if landmark.visibility > 0:
                        landmark_x = landmark.x * width
                        landmark_y = landmark.y * height
                        total_x += landmark_x
                        total_y += landmark_y
                        num_landmarks += 1
                if num_landmarks > 0:
                    centre_x = total_x / num_landmarks
                    centre_y = total_y / num_landmarks
                else:
                    centre_x = width / 2
                    centre_y = height / 2
                all_center_x.append(centre_x)
                all_center_y.append(centre_y)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        # The final center of the whole pose sequence for each word      
        final_center_x = sum(all_center_x)/len(all_center_x)
        final_center_y = sum(all_center_y)/len(all_center_y)
    
        # The displacement of the pose sequence from the center area of the frame
        displacement_x = 0.5 * width - final_center_x
        displacement_y = 0.75 * height - final_center_y
        

        # Normalization by adding the required displacement
        for result in all_pose_info:
            if result.pose_landmarks:
                for landmark in result.pose_landmarks.landmark:
                    landmark.x =(landmark.x * width + displacement_x)/ width
                    # landmark.y =(landmark.y*height+displacement_y)/height   # Seems better without y-axis normalization
            if result.right_hand_landmarks:
                for landmark in result.right_hand_landmarks.landmark:
                    landmark.x =(landmark.x * width + displacement_x)/ width
                    # landmark.y =(landmark.y*height+displacement_y)/height
            if result.left_hand_landmarks:
                for landmark in result.left_hand_landmarks.landmark:
                    landmark.x =(landmark.x * width + displacement_x)/ width 
                    # landmark.y =(landmark.y*height+displacement_y)/height  
            normalized_pose_info.append(result)
        print("Poses have been normalized")

        i=0
        for frame_result in normalized_pose_info:
            mp_drawing = mp.solutions.drawing_utils
            # mp_drawing.draw_landmarks(black_image, normalized_results.face_landmarks, mp_holistic.FACEMESH_CONTOURS, landmark_drawing_spec=None, connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_contours_style())
            mp_drawing.draw_landmarks(all_black_image[i], frame_result.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
            mp_drawing.draw_landmarks(all_black_image[i], frame_result.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
            mp_drawing.draw_landmarks(all_black_image[i], frame_result.pose_landmarks, mp_holistic.POSE_CONNECTIONS,landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())
            out.write(all_black_image[i])
            
            i+=1

    cap.release()
    out.release()
    print("Pose video saved successfully for word:", word)
    print("Deleting original video")
    os.remove("./videos/" + downloaded_video_path)
    return output_path

def join_videos(video_paths, output_path, mode):

    videos = [cv2.VideoCapture(path) for path in video_paths]
    fps = int(videos[0].get(cv2.CAP_PROP_FPS))
    width = 1000
    height = 565
    fourcc = cv2.VideoWriter_fourcc(*'avc1') # avc1 to avoid codec error change to 'mp4v' if not needed
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    for i in range(len(video_paths)):
        while videos[i].isOpened():
            ret, frame = videos[i].read()
            if not ret:
                break
            frame = cv2.resize(frame,(width ,height)) # Resize each frame to a common dimension

            # Text overlay on frame
            if mode=="letter":
                cv2.putText(frame,video_paths[i][-5], (60, 200), cv2.FONT_HERSHEY_SIMPLEX, 1.7, (255, 255, 255), 2) # based on folder and file naming
            else:
                cv2.putText(frame,video_paths[i][20:-4], (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2)

            out.write(frame)

    for video in videos:
        video.release()
    out.release()
    print("Videos joined successfully. Output:", output_path)


def generate_final_video(sentence):
    sentence = sentence.title()
    words = sentence.split()

    # Pose video for each word
    video_paths = []
    pose_files = [ file for file in os.listdir("./videos/words_pose") ]
    for word in words:
       
        if not word.isalnum(): # Do nothing for special characters
            continue 
        elif word+".mp4" in pose_files or word.upper()+".mp4" in pose_files:
            video_path = "./videos/words_pose/"+ word + ".mp4"
            print("Pose Video Available :", video_path)
        else:
            video_path = generate_pose_video(word)

        # Finger-spell each letter of word if no video is found
        if not video_path:
            print("Fingerspelling word: ",word)
            letter_paths = ["./videos/alphanums_pose/"+letter.upper()+".mp4" for letter in word]
            video_path = "./videos/words_pose/"+ word.upper() + ".mp4"
            join_videos(letter_paths, video_path, mode="letter")
    
        video_paths.append(video_path)
    final_video_url = "./videos/"+sentence+".mp4"

    join_videos(video_paths, final_video_url, mode="words")
    return final_video_url
