import unittest
import json
from backend import server

app = server.app


class TestIntegrationBackend(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        app.config['TESTING'] = True

    # Integration Test: Testing interactions between components

    def test_process_sentence(self):
        # Integration test for processing a sentence
        print("\n-------System Test for Processing a sentence-------\n")
        print("Test Info: POST request to /process \nPOST input parameter: {\"sentence\": \"This is a test sentence.\"} \n")
        response = self.app.post('/process', json={"sentence": "This is a test sentence."})
        print("\nResponse status: ",response.status_code)
        self.assertEqual(response.status_code, 200,"request error")
        data = json.loads(response.data)
        print("Output Data: ", data)
        self.assertIn('videoPath', data,"No Video path data")
        self.assertIn('gloss', data,"No gloss data")

    def test_invalid_sentence(self):
        # Test processing an invalid sentence
        print("\n-------Test processing an invalid sentence-------\n")
        print("Test Info: POST request to /process \nPOST input parameter: {\"sentence\": \"\"} \n")
        response = self.app.post('/process', json={"sentence": ""})
        data = json.loads(response.data)
        print("Output Data: ", data)
        self.assertEqual(data["videoPath"],'')
        self.assertEqual(data["gloss"],'')

    # # System Test: Testing the entire system as a whole
    # def test_serve_video(self):
    #     # System test for serving a video
    #     print("\n-------Integration Test for Processing a sentence-------\n")
    #     print("Test Info: GET request to test file serving\nGET parameter: /videos/This Test Sentence.mp4\n")
    #     response = self.app.get('/videos/This Test Sentence.mp4')
    #     print("Response status: ",response.status_code)
    #     print("Response content type: ",response.content_type)
    #     self.assertEqual(response.status_code, 200, "serve file error")
    #     self.assertEqual(response.content_type, 'video/mp4')

if __name__ == '__main__':
    unittest.main()