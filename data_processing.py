import pandas as pd
import json

with open('playlist[76][36][48][6].json') as file:  
    data = json.load(file)

df = pd.DataFrame(data)
normalized_df = pd.json_normalize(df.to_dict(orient="records"))

normalized_df.to_csv('normalized_songs.csv', index=False)
