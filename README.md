# DevOps CI/CD Pipeline with Jenkins, Docker, and GitHub

## Project Overview
This project demonstrates a complete CI/CD pipeline using **Jenkins, Docker, and GitHub**, deployed on an **AWS EC2 instance**. It automates the building, testing, and deployment of a simple **Node.js application** that displays "Hello" in the browser.

## Features
- **Automated Builds**: Jenkins triggers builds on new commits.
- **Dockerized Application**: Runs inside a containerized environment.
- **GitHub Webhooks**: Auto-deployment upon `git push`.
- **AWS EC2 Deployment**: Hosted on a cloud instance.
- **GPG Key and SSH Integration**: Secure authentication between Jenkins and GitHub.

---

## Prerequisites
Ensure you have the following installed and configured:
- An AWS EC2 instance with **Docker** and **Jenkins** installed.
- A **GitHub repository** for the Node.js application.
- SSH and **GPG keys** for secure authentication.
- **Jenkins Plugins**:
  - Git Plugin
  - Docker Pipeline Plugin
  - Pipeline Plugin

---

## Steps to Set Up

### 1. Set Up GPG Keys and SSH Integration with GitHub
#### **Generate a GPG Key (Optional for GitHub Signing)**
```sh
 gpg --full-generate-key
```
Choose `RSA and RSA`, set key size `4096`, and set an expiration if needed.

#### **Retrieve the GPG Key**
```sh
gpg --list-secret-keys --keyid-format LONG
```
Copy the `key-id` from the output.

#### **Export Public GPG Key to GitHub**
```sh
gpg --armor --export <key-id>
```
Add this key to **GitHub → Settings → SSH and GPG keys → New GPG Key**.

#### **Generate SSH Key Pair for Jenkins-GitHub Authentication**
```sh
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```
Store the keys in `/var/lib/jenkins/.ssh/` (or your Jenkins user's home directory).

#### **Add SSH Key to GitHub**
Copy the public key:
```sh
cat ~/.ssh/id_rsa.pub
```
Add it to **GitHub → Settings → SSH and GPG Keys → New SSH Key**.

#### **Configure SSH in Jenkins**
- Go to **Jenkins → Manage Jenkins → Credentials**.
- Add a new credential of type **SSH Username with Private Key**.
- Paste the private key from `~/.ssh/id_rsa`.

---

### 2. Install and Configure Jenkins on AWS EC2
#### **Install Jenkins**
```sh
sudo apt update && sudo apt install -y openjdk-11-jdk jenkins
```
#### **Start and Enable Jenkins**
```sh
sudo systemctl start jenkins
sudo systemctl enable jenkins
```
#### **Unlock Jenkins**
Retrieve the initial admin password:
```sh
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```
Follow the UI setup and install necessary plugins.

---

### 3. Set Up Docker on Jenkins EC2 Instance
#### **Install Docker**
```sh
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
```
#### **Add Jenkins to Docker Group**
```sh
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

---

### 4. Configure GitHub Webhook for Jenkins
1. Navigate to **GitHub → Your Repo → Settings → Webhooks**.
2. Click **Add Webhook**.
3. Enter your Jenkins webhook URL: `http://<EC2-PUBLIC-IP>:8080/github-webhook/`.
4. Select `application/json` format and choose **Push events**.
5. Save and test the webhook.

---

### 5. Create a Jenkins Pipeline
#### **Jenkinsfile** (Add this to your repo)
```groovy
pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                git 'git@github.com:your-repo.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t my-node-app .'
            }
        }
        stage('Run Container') {
            steps {
                sh 'docker run -d -p 8070:8000 --name my-node-app-container my-node-app'
            }
        }
    }
}
```

---

### 6. Deploy and Access the App
After Jenkins successfully builds and runs the container, access the app via:
```sh
http://<EC2-PUBLIC-IP>:8070
```

---

## Conclusion
This project demonstrates a **full DevOps CI/CD workflow** using Jenkins, Docker, and AWS EC2. It automates code deployment with GitHub webhooks and ensures a seamless pipeline from **code push to live deployment**.

#### 🚀 Feel free to fork, contribute, or reach out for improvements!

