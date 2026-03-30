# 🛡️ Context-Aware Access (CAA) Disaster Recovery & Audit Dashboard

A custom-built security posture tool for Google Workspace administrators to backup, audit, and restore Context-Aware Access (CAA) rules.

## 📌 Overview
[cite_start]Context-Aware Access rules in Google Workspace are built on top of Google Cloud's Access Context Manager[cite: 6]. [cite_start]Currently, there is no native "Recycle Bin" or version history for these rules in the Workspace Admin Console[cite: 7]. 

[cite_start]This tool utilizes **Google Apps Script** (React.js + Tailwind CSS) to bridge that gap, serving as a centralized dashboard for configuration governance[cite: 8].

## ✨ Key Features
* [cite_start]**Backup:** Extract all CAA rules (IP subnets, device policies, custom CEL expressions) as raw JSON and store them in Google Sheets[cite: 10].
* [cite_start]**Audit (Reconciliation):** Automatically detect "Configuration Drift" or accidental deletions by comparing the live Google Cloud environment against your latest backup[cite: 11].
* [cite_start]**Disaster Recovery:** Revert modified policies or recreate deleted rules with a single click[cite: 12].
* [cite_start]**Modern UI:** A responsive dashboard built with React and Tailwind CSS for real-time monitoring[cite: 96, 97].

## 🚀 Deployment Guide

### Prerequisites
* [cite_start]Google Workspace **Super Admin** privileges[cite: 15].
* [cite_start]Access to **Google Cloud Console** to enable APIs[cite: 16].
* [cite_start]A standard GCP Project[cite: 34].

### Step 1: Retrieve Your Access Policy ID
1.  [cite_start]Open **Cloud Shell** in your Google Cloud Console[cite: 21].
2.  [cite_start]Get your Organization ID: `gcloud organizations list`[cite: 22].
3.  [cite_start]Get your Policy ID: `gcloud access-context-manager policies list --organization=YOUR_ORGANIZATION_ID`[cite: 23].
4.  [cite_start]Copy the numeric ID from the `NAME` column (e.g., `528220979009`)[cite: 24, 25].

### Step 2: Prepare the Database
1.  [cite_start]Create a new **Google Sheet** named "CAA Security Backups"[cite: 27, 28].
2.  [cite_start]Copy the **Sheet ID** from the URL[cite: 30].
3.  [cite_start]Rename the first tab to `CAA Backup`[cite: 31].

### Step 3: Google Apps Script Setup
1.  [cite_start]Create a new project at [script.google.com](https://script.google.com)[cite: 41].
2.  [cite_start]In **Project Settings**, link your GCP Project using the **Project Number**[cite: 43, 44, 45].
3.  [cite_start]Enable the `"Show 'appsscript.json' manifest file"` checkbox[cite: 46].
4.  Copy the code from the `src/` folder of this repository into the corresponding files in the editor:
    * [cite_start]`appsscript.json` [cite: 49]
    * [cite_start]`Code.gs` (Update your `POLICY_ID` and `SHEET_ID`) [cite: 55, 59]
    * [cite_start]`Index.html` [cite: 96]

### Step 4: Deployment
1.  [cite_start]Click **Deploy** > **New Deployment**[cite: 140, 141].
2.  [cite_start]Select **Web App**[cite: 142].
3.  Execute as: **Me**; [cite_start]Who has access: **Only myself**[cite: 145, 146].
4.  [cite_start]Authorize the permissions when prompted[cite: 148, 149].

## 🛠️ Usage
1.  [cite_start]**Initial Sync:** Open the Web App URL and click `🔄 Force Sync & Backup` to create your first baseline[cite: 157, 158].
2.  [cite_start]**Monitoring:** The dashboard will flag rules as `Configuration Drift` if changes are detected[cite: 160].
3.  [cite_start]**Recovery:** Click `⏪ Restore Backup` to revert changes or recreate a missing rule via API[cite: 161, 162, 163].

## 📝 Configuration Settings
The following variables in `Code.gs` must be configured:
| Variable | Description |
| :--- | :--- |
| `POLICY_ID` | [cite_start]Your numeric Access Policy ID from GCP[cite: 60]. |
| `SHEET_ID` | [cite_start]The unique ID of your Google Sheet database[cite: 60]. |
| `SHEET_NAME` | [cite_start]The name of the tab where data is stored[cite: 61]. |

---
**Disclaimer:** This is a custom tool and is not an official Google product. Always test recovery in a sandbox environment before deploying to production.
