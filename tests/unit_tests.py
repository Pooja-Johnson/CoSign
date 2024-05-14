import unittest
from backend.util import pose_estimation_main
from backend.util import text_to_gloss
from backend import server

app = server.app

class TestUnitsBackend(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        app.config['TESTING'] = True

    # Unit Test: Testing individual components or functions in isolation
    
    def test_glossify(self):
        # Unit test for the glossify function
        print("\n-------Unit Test for Text-to-Gloss Conversion-------")
        print("Test Input: This is a test sentence.")
        result = text_to_gloss.glossify("I didnt pass the exam")
        print("Test Output: ",result)
        self.assertEqual(result, "This Test Sentence","Test Failed")

    def test_pose_estimation_word(self):
         # Unit test for Pose Video Generation for a word
        print("\n-------Unit Test for Normalised Pose Video Generation for a word-------")
        print("Test Input: Cat")
        video_path = pose_estimation_main.generate_pose_video("Cat")
        print("Test Output: ",video_path)
        self.assertEqual(video_path, "./videos/words_pose/Cat.mp4","Test Failed")

    def test_fingerspell(self):
        # Unit test for Fingerspelling unknown words
        print("\n-------Unit Test for Fingerspelling unknown words-------")
        print("Test Input: 2024")
        video_path = pose_estimation_main.generate_final_video("2024")
        print("Test Output: ",video_path)
        self.assertEqual(video_path, "./videos/2024.mp4","Test Failed")

    def test_pose_estimation_sentence(self):
        #  Unit test for  Pose Video Generation for any simple sentence
        print("\n-------Unit Test for Normalised Pose Video Generation for a sentence-------")
        print("Test Input: This Test Sentence")
        video_path = pose_estimation_main.generate_final_video("This Test Sentence")
        print("Test Output: ",video_path)
        self.assertEqual(video_path, "./videos/This Test Sentence.mp4","Test Failed")

if __name__ == '__main__':
    unittest.main()