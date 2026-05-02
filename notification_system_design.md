# Notification System Design

## Overview

This system handles vehicle maintenance scheduling and logging using backend services.

## Components

### 1. API Layer

* Fetches depot and vehicle data
* Uses authentication token

### 2. Scheduling Engine

* Uses Knapsack algorithm
* Maximizes impact under mechanic hour constraints

### 3. Logging Middleware

* Logs backend events (info, error, controller, service)

### 4. Express Server

* Endpoint: `/schedule`
* Returns optimized task allocation

## Flow

1. Authenticate with API
2. Fetch depots & vehicles
3. Extract mechanic hours
4. Run knapsack optimization
5. Return selected tasks

## Tech Stack

* Node.js
* Express.js
* Axios

## Improvements

* Add caching
* Add frontend dashboard
* Optimize large dataset handling
