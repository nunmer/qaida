# Qaida

## Product Overview

Qaida is a web-based geography game inspired by GeoGuessr but focused entirely on Kazakhstan.

Players are shown photographs of streets, landmarks, villages, roads, landscapes, monuments, buildings, and public places from across Kazakhstan and must identify where the image was taken.

The goal is to create the most recognizable and addictive Kazakhstan-focused game that can be understood within 10 seconds by any user regardless of age.

Core principle:

"Recognize Kazakhstan."

Not:

"Be good at geography."

The game should appeal equally to:

* Students
* University students
* Office workers
* Travelers
* Kazakhstan residents
* Expats
* Foreigners interested in Kazakhstan

---

# Product Goals

## Primary Goal

Create a game that users can play immediately without reading instructions.

Target onboarding:

* User lands on website
* Clicks Play
* Sees photo
* Places guess
* Receives score

Total onboarding time:

< 20 seconds

---

## Secondary Goal

Teach users about Kazakhstan.

Every completed round should make players learn:

* Cities
* Regions
* Landmarks
* Architecture
* Nature
* Culture

---

## Business Goal

Build a highly shareable product with:

* Daily challenges
* Leaderboards
* Friend competitions
* Regional pride

---

# User Personas

## Casual User

Visits from TikTok or Instagram.

Wants:

* Quick entertainment
* No registration

Session duration:
3-10 minutes

---

## Competitive User

Wants:

* Rankings
* Statistics
* Streaks

Session duration:
20-60 minutes

---

## Educational User

Wants:

* Learn Kazakhstan
* Improve regional knowledge

Session duration:
10-20 minutes

---

# Design Principles

## Fast

No loading screens.

Every interaction should feel instant.

---

## Minimal

No clutter.

One goal on screen at a time.

---

## Mobile First

80% of users are expected to come from phones.

Every screen must be designed for mobile before desktop.

---

## Kazakhstan Identity

Subtle national style.

Avoid:

* Heavy ornaments
* Government style visuals
* Traditional overload

Use:

* Light ornament accents
* Turquoise and gold highlights
* Modern clean design

---

# Branding

## Name

Qaida

Alternative:

* Qai Qala
* Men Qaidamyn
* GeoKZ

---

## Tagline

How well do you know Kazakhstan?

Alternative:

Can you recognize your country?

---

# Core Gameplay

## Round Flow

### Step 1

Player starts game.

---

### Step 2

Random image appears.

Image types:

* Street
* Landmark
* Building
* Nature
* Village
* Road
* Monument

---

### Step 3

Player analyzes image.

---

### Step 4

Player selects location.

Methods:

* Pin on map
* City selection
* Region selection

Depends on game mode.

---

### Step 5

Player submits answer.

---

### Step 6

Result shown:

* Correct location
* Distance
* Score
* Explanation

---

### Step 7

Next round starts automatically.

---

# Game Modes

## Quick Play

Default mode.

5 rounds.

Duration:
2-5 minutes

---

## Daily Challenge

All players receive same locations.

Resets daily.

Features:

* Daily leaderboard
* Shareable results

---

## Infinite Mode

Unlimited rounds.

Focus:

* High scores
* Long streaks

---

## Region Challenge

Example:

Only Mangystau.

Only East Kazakhstan.

Only Almaty Region.

---

## Landmark Mode

Only famous locations.

Suitable for beginners.

---

## Expert Mode

Hardest locations:

* Villages
* Roads
* Industrial areas
* Desert

---

## Multiplayer (Phase 2)

Real-time gameplay.

Players receive same image.

Fastest correct answer wins.

---

# Scoring System

## Distance Formula

Maximum:

5000 points

Distance reduces score.

Closer guess = higher score.

---

## Bonuses

### Speed Bonus

Fast answer:

+100 to +500

---

### Streak Bonus

Consecutive correct answers:

Multiplier grows.

---

### Perfect Guess

Within 1 kilometer.

Special badge.

---

# Educational Layer

After every guess show:

## Location Information

* City
* Region
* Population
* Interesting fact

Example:

This location is Aktau.

Aktau is the only major city in Kazakhstan located on the Caspian Sea.

---

## Learning Benefit

Users gradually memorize:

* Geography
* Regions
* Landmarks

Without feeling like studying.

---

# Social Features

## Share Card

Generate image:

Qaida

Score: 21,550

Cities Found:
✓ Astana
✓ Almaty
✓ Aktau

Can you beat me?

One-click share.

---

## Friend Challenges

Generate unique URL.

Friend attempts same game.

Compare scores.

---

## Regional Pride

User selects hometown.

Leaderboards:

Top Astana Players

Top Aktau Players

Top Shymkent Players

---

# Leaderboards

## Global

All users.

---

## Weekly

Weekly rankings.

---

## Monthly

Monthly rankings.

---

## Regional

By city.

---

## Friends

Visible after login.

---

# Progression

## XP

Every game grants XP.

---

## Levels

Level 1-100.

Purely cosmetic.

---

## Unlocks

New badges.

Profile decorations.

Titles.

Examples:

Road Explorer

Village Hunter

Mangystau Master

Steppe Legend

---

# User Profile

Contains:

* Avatar
* Username
* Rating
* XP
* Games played
* Best streak
* Accuracy
* Favorite region

---

# Statistics

Track:

* Correct guesses
* Average distance
* Favorite regions
* Win rate
* Daily activity

---

# Admin Panel

## Location Management

Add location.

Upload image.

Assign metadata.

---

## Metadata

Location includes:

* Latitude
* Longitude
* City
* Region
* Category
* Difficulty

---

## Categories

Street

Landmark

Nature

Village

Industrial

Road

Architecture

---

# Data Model

## Users

id

username

rating

level

xp

games_played

best_streak

created_at

---

## Locations

id

image_url

latitude

longitude

city

region

difficulty

category

description

approved

---

## Sessions

id

user_id

score

mode

started_at

ended_at

---

## Guesses

id

session_id

location_id

guess_latitude

guess_longitude

distance

points

created_at

---

# Frontend Architecture

## Stack

Next.js

TypeScript

Tailwind

TanStack Query

Zustand

MapLibre

---

# Backend Architecture

## Stack

FastAPI

PostgreSQL

Redis

SQLAlchemy

Alembic

Celery

---

# API Endpoints

GET /api/game/start

GET /api/game/location

POST /api/game/guess

GET /api/leaderboard

GET /api/profile

GET /api/stats

GET /api/daily

POST /api/auth/login

POST /api/auth/logout

---

# Infrastructure

## Containers

Frontend

Backend

PostgreSQL

Redis

Prometheus

Grafana

Nginx

---

# Monitoring

Metrics:

* Active users
* Games started
* Games completed
* Average score
* API latency
* Error rate

---

# Security

Rate limiting

Input validation

JWT authentication

CSRF protection

Image access control

---

# Performance Requirements

Page load:
< 2 seconds

API response:
< 200 ms

Image loading:
< 1 second

Lighthouse score:
90+

---

# Mobile Experience

Fully responsive.

Portrait-first design.

Large touch targets.

Thumb-friendly navigation.

---

# Accessibility

Keyboard support.

Screen reader support.

High contrast mode.

Colorblind-friendly indicators.

---

# Future Roadmap

Phase 1:

* Core gameplay
* Daily challenge
* Leaderboards

Phase 2:

* Multiplayer
* Friend challenges
* XP system

Phase 3:

* Mobile app
* AI-generated hints
* Community-created maps

Phase 4:

* Central Asia expansion
* Kyrgyzstan
* Uzbekistan
* Mongolia
* Caucasus packs

---

# Success Metrics

Day 1 retention:
40%

Day 7 retention:
20%

Average session:
10+ minutes

Games per session:
5+

Share rate:
15%

Daily active users:
1000+ within first 6 months
