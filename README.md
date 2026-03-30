# 🛡️ Google Workspace CAA Backup & Recovery Dashboard

A specialized security posture tool designed for Google Workspace Administrators to manage **Context-Aware Access (CAA)** configurations. This tool provides automated backup, configuration drift detection, and one-click disaster recovery.

---

## 📖 Overview

Context-Aware Access (CAA) rules in Google Workspace are built on Google Cloud's **Access Context Manager**. Currently, the Workspace Admin Console lacks a native "Recycle Bin" or version history for these rules. 

This dashboard bridges that gap by using **Google Apps Script** (React.js + Tailwind CSS) to store configurations in **Google Sheets** and provide a management interface for reconciliation and recovery.

## ✨ Key Features

*   **Automated Backup:** Syncs live CAA rules (IP subnets, device policies, CEL expressions) into Google Sheets as raw JSON baselines.
*   **Drift Detection:** Automatically identifies "Configuration Drift" by comparing live GCP environments against the last known healthy backup.
*   **One-Click Recovery:** 
    *   **Restore:** Reverts unauthorized modifications to the backup state.
    *   **Recreate:** Instantly redeploys rules that were accidentally deleted.
*   **Audit Trail:** Maintains a timestamped history of all policy states in a dedicated spreadsheet.

## 🚀 Deployment Guide

### 1. Prerequisites
*   Google Workspace **Super Admin** access.
*   A **Google Cloud Project** with the **Access Context Manager API** enabled.
*   Knowledge of your **Organization ID** and **Access Policy ID**.

### 2. Retrieve Infrastructure IDs
Run these commands in the [Google Cloud Shell](https://console.cloud.google.com/):
1.  **Get Org ID:** `gcloud organizations list`
2.  **Get Policy ID:** `gcloud access-context-manager policies list --organization=YOUR_ORG_ID`
3.  *Note the numeric Policy ID (e.g., 528220979009).*

### 3. Setup Script Environment
1.  Create a new [Google Apps Script](https://script.new) project.
2.  In **Project Settings**, link your GCP Project using the **Project Number**.
3.  Enable the `appsscript.json` manifest file in settings.
4.  Copy the code from the `src/` folder:
    *   `Code.gs`: Update `POLICY_ID` and `SHEET_ID` placeholders.
    *   `Index.html`: The React-based dashboard UI.
    *   `appsscript.json`: Required OAuth scopes.

### 4. Authorization & Deployment
1.  Click **Deploy > New Deployment**.
2.  Select **Web App**, set "Execute as" to **Me**, and "Who has access" to **Only myself**.
3.  Authorize the app (Click *Advanced > Go to CAA Recovery Console* if prompted).

## 🛠️ Tech Stack
*   **Backend:** Google Apps Script (V8 Runtime)
*   **Frontend:** React.js 18 (via CDN)
*   **Styling:** Tailwind CSS
*   **Database:** Google Sheets API
*   **Infrastructure:** Access Context Manager API (GCP)

---
*Disclaimer: This is an independent tool and is not an official Google Cloud/Workspace product. Use at your own risk.*
