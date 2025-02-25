import sys
import json
import easyocr

reader = easyocr.Reader(['en'])
image_url = sys.argv[1]

text = reader.readtext(image_url, detail=0)
response = {"text": " ".join(text)}

print(json.dumps(response))
