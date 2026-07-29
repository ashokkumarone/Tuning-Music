-- Tuning — Database Schema
-- Used by the server.ts backend in this repo

-- Users Table
CREATE TABLE Users (
    User_ID         INT PRIMARY KEY,
    Handle          VARCHAR(50) UNIQUE NOT NULL,
    Subscription    ENUM('Free', 'Pro') DEFAULT 'Free',
    Created_At      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Songs Metadata Table
CREATE TABLE Songs_Meta (
    Song_ID         VARCHAR(50) PRIMARY KEY,
    Song_Name       VARCHAR(200),
    Artist          VARCHAR(200),
    Lyrics_JSON     JSON,
    Emotion_Tags    VARCHAR(500)
);

-- Tuning Logs — Core Interaction Tracker
CREATE TABLE Tuning_Logs (
    Log_ID           INT PRIMARY KEY AUTO_INCREMENT,
    Sender_ID        INT REFERENCES Users(User_ID),
    Receiver_ID      INT REFERENCES Users(User_ID),
    Song_ID          VARCHAR(50) REFERENCES Songs_Meta(Song_ID),
    Timestamp_Start  FLOAT,
    Reaction         VARCHAR(10),
    Sent_At          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
