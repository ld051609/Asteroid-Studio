import requests
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
import os
import datetime
import pandas as pd

def extract_features(close_approach_data):
    features = []
    for approach in close_approach_data:
        date = approach['close_approach_date']
        velocity = float(approach['relative_velocity']['kilometers_per_second'])
        features.append({
            'date': date,
            'velocity': velocity
        })
    return features


def normalize(data):
    """Normalize data to the range [0, 1]."""
    min_val = np.min(data)
    max_val = np.max(data)
    return (data - min_val) / (max_val - min_val)


# Prepare data for sonification
def prepare_sonification_data(data):
    df = pd.DataFrame(data)
    
    # Convert date to datetime and extract year
    df['date'] = pd.to_datetime(df['date'])
    df['year'] = df['date'].dt.year
    
    # Convert velocity to float
    df['velocity'] = df['velocity'].astype(float)
    
    # Normalize velocity
    df['normalized_velocity'] = normalize(df['velocity'])
    
    return df

def generate_tone(frequency, duration_ms, volume_db):
    wave_forms = ['sine', 'square', 'sawtooth']
    random_int = random.randint(0,2)
    waveform = wave_forms[random_int]
    if waveform == 'sine':
        tone = Sine(frequency).to_audio_segment(duration=duration_ms)
    elif waveform == 'square':
        tone = Square(frequency).to_audio_segment(duration=duration_ms)
    elif waveform == 'sawtooth':
        tone = Sawtooth(frequency).to_audio_segment(duration=duration_ms)
    tone = Sine(frequency).to_audio_segment(duration=duration_ms)
    tone = tone + volume_db  # Adjust volume
    return tone
def create_sonification(df):
    min_year = df['year'].min()
    max_year = df['year'].max()
    min_velocity = df['normalized_velocity'].min()
    max_velocity = df['normalized_velocity'].max()
    
    # Initialize empty audio segment
    combined_audio = AudioSegment.silent(duration=0)
    
    for index, row in df.iterrows():
        year = row['year']
        velocity_normalized = row['normalized_velocity']
        
        # Map year to frequency (in Hz)
        frequency = np.interp(year, [min_year, max_year], [10, 1000])  
        
        # Map normalized velocity to volume (in dB)
        volume_db = np.interp(velocity_normalized, [min_velocity, max_velocity], [-20, 0])  
        
        # Duration in milliseconds
        duration_ms = 16  # Duration for each tone
        
        # Generate tone
        tone = generate_tone(frequency, duration_ms, volume_db)
        
        # Append tone to combined audio segment
        combined_audio += tone
    
    # Export combined audio track
    combined_audio.export('../frontend/sound_data/combined_sonification.mp3', format='mp3')

