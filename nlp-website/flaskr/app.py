import sys
sys.path.append("/Users/liliangong/workspace_lil/mars_develop/Mathematical-Knowledge-Entity-Recognition")
from main import get_named_entities,build_model
import pandas as pd
import numpy as np 
from googletrans import Translator
from flask import Flask,request,jsonify
import json
from flask_cors import CORS, cross_origin


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

t = Translator()
ckpt_file,_model,saver,sess = build_model()
baike_df = pd.read_csv('/Users/liliangong/workspace_lil/mars_develop/agg_data/baike_w_eng.csv')
baike_df[baike_df['_def']!=None]


def get_text():
    data = request.get_data()
    return json.loads(data.decode("utf-8"))


def get_eng_entities(text):
    lan = t.detect(text)
    if lan != 'zh-cn':
        text = t.translate(text,dest='zh-cn').text
    entities = get_named_entities(ckpt_file,_model,saver,sess,text)
    eng_ent = [t.translate(e,dest='en').text for e in entities]
    return entities, eng_ent


@app.route('/getEntites',methods=['POST'])
@cross_origin()
def get_entites():
    text = get_text()["text"]
    print(text)
    ent, eng_ent = get_eng_entities(text)
    print("entitVies in chinese : {} ; entities in english : {}".format(ent,eng_ent))
    return jsonify({'chn':ent, 'eng':eng_ent})



# @app.after_request
# def after(response):
#     # todo with response
#     print(response.status)
#     print(response.headers)
#     print(response.get_json())
#     return response


@app.route('/getDefinition',methods=['POST'])
@cross_origin()
def get_eng_def():
    ent_ls= get_text()['chn']
    result = []
    unlisted = []
    for ent in ent_ls:
        res = baike_df[baike_df['entity']==ent]
        if len(res)==0:
            unlisted.append(ent)
        else:
            result.append({ent:t.translate(res['_def'].values[0]).text})
    print(result)
    return jsonify({"unlisted":unlisted,"result":result})





if __name__ == '__main__':
    app.run(debug = True)

# 
# text = '椭圆和双曲线'
# print(get_eng_entities(text))


# 
# t.translate(,dest='zh-cn').text