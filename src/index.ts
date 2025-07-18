// OPSWAT Security Awareness Training Platform

interface SecurityInsight {
  category: string;
  content: string;
}

interface SecurityQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface UserProgress {
  streakCount: number;
  correctAnswers: number;
  insightsRead: number;
  lastVisit: string;
}

class OPSWATSecurityApp {
  private currentQuestion: SecurityQuestion | null = null;
  private selectedAnswer: number | null = null;
  private userProgress: UserProgress;

  private securityInsights: SecurityInsight[] = [
    {
      category: "Critical Infrastructure Protection",
      content: "Air-gapped networks aren't completely isolated. USB devices, maintenance laptops, and remote access points can create unexpected bridges. Implement strict device controls and monitor all network boundaries, even in supposedly isolated systems."
    },
    {
      category: "Endpoint Security",
      content: "Multi-scanning with multiple anti-malware engines increases detection rates by 15-20%. Different engines excel at detecting different threat types. OPSWAT's multi-scanning approach provides comprehensive protection against advanced threats."
    },
    {
      category: "File Upload Security",
      content: "File sanitization removes active content that could exploit vulnerabilities. This process reconstructs files to eliminate embedded threats while preserving functionality - essential for critical infrastructure environments."
    },
    {
      category: "Zero Trust Architecture",
      content: "Never trust, always verify. Every device, user, and network flow should be authenticated and authorized before accessing critical systems. Implement continuous verification rather than perimeter-based security."
    },
    {
      category: "Supply Chain Security",
      content: "Third-party software components can introduce vulnerabilities into critical systems. Maintain an inventory of all software components and monitor for known vulnerabilities. Implement secure software development lifecycle practices."
    },
    {
      category: "Operational Technology (OT) Security",
      content: "OT systems require specialized security approaches. Traditional IT security tools may disrupt operations. Implement OT-specific monitoring, segmentation, and incident response procedures."
    },
    {
      category: "Threat Intelligence",
      content: "Proactive threat hunting identifies threats before they cause damage. Use indicators of compromise (IoCs) and threat intelligence feeds to detect advanced persistent threats targeting critical infrastructure."
    },
    {
      category: "Incident Response",
      content: "Time is critical in cybersecurity incidents. Have a well-tested incident response plan, practice regular drills, and maintain relationships with law enforcement and cybersecurity agencies for rapid response coordination."
    }
  ];

  private securityQuestions: SecurityQuestion[] = [
    {
      question: "A contractor brings a USB drive to update software on a critical control system. What is the most appropriate security measure?",
      options: [
        "Allow the USB if the contractor is authorized",
        "Scan the USB with standard antivirus only",
        "Use a multi-scanning kiosk with file sanitization before allowing access",
        "Reject all USB devices completely"
      ],
      correctAnswer: 2,
      explanation: "Multi-scanning with file sanitization provides the highest level of protection while allowing necessary business operations. This approach detects threats that single engines might miss and removes active content that could exploit vulnerabilities."
    },
    {
      question: "Your organization implements an air-gapped network for critical operations. What is still a significant security concern?",
      options: [
        "Network-based attacks from the internet",
        "Physical access controls and removable media",
        "Email-based phishing attacks",
        "Web application vulnerabilities"
      ],
      correctAnswer: 1,
      explanation: "Air-gapped networks are still vulnerable to physical attacks and contaminated removable media. Stuxnet famously used USB drives to cross air gaps. Physical security and strict media controls are essential."
    },
    {
      question: "In a Zero Trust security model for critical infrastructure, what should be verified?",
      options: [
        "Only user credentials at login",
        "Device health and user identity continuously",
        "Network perimeter security only",
        "Just the initial connection attempt"
      ],
      correctAnswer: 1,
      explanation: "Zero Trust requires continuous verification of both device health and user identity. This includes checking for malware, policy compliance, and ongoing authentication throughout the session."
    },
    {
      question: "When implementing OT (Operational Technology) security, what is a key consideration?",
      options: [
        "Apply the same security tools used for IT systems",
        "Prioritize security over operational availability",
        "Balance security with operational continuity and safety",
        "Focus only on network segmentation"
      ],
      correctAnswer: 2,
      explanation: "OT security must balance protection with operational continuity and safety. Disrupting industrial processes can have severe consequences. Security measures must be carefully designed to protect without interfering with operations."
    },
    {
      question: "A file upload portal for your critical infrastructure receives documents from external partners. What security approach is most effective?",
      options: [
        "Basic antivirus scanning only",
        "File type restrictions and size limits",
        "Multi-engine scanning with Content Disarm and Reconstruction (CDR)",
        "Manual review of all files"
      ],
      correctAnswer: 2,
      explanation: "Multi-engine scanning catches more threats, and CDR removes all potentially malicious content while preserving file functionality. This provides the highest level of protection for critical infrastructure."
    },
    {
      question: "Your organization detects unusual network traffic on OT systems. What should be the immediate priority?",
      options: [
        "Investigate the traffic source thoroughly",
        "Immediately disconnect all OT systems",
        "Continue monitoring while assessing safety implications",
        "Restart all affected systems"
      ],
      correctAnswer: 2,
      explanation: "Safety must be the primary concern. Assess whether the incident could impact physical safety while continuing to monitor. Hasty disconnection could cause safety hazards in industrial environments."
    },
    {
      question: "What is the most effective approach to threat intelligence for critical infrastructure protection?",
      options: [
        "Focus only on public threat feeds",
        "Combine multiple intelligence sources with sector-specific information",
        "Rely solely on government alerts",
        "Use only vendor-provided intelligence"
      ],
      correctAnswer: 1,
      explanation: "Effective threat intelligence combines multiple sources including sector-specific feeds, government alerts, commercial intelligence, and peer sharing within critical infrastructure sectors."
    },
    {
      question: "During a cybersecurity incident affecting critical infrastructure, who should be notified first?",
      options: [
        "Local law enforcement only",
        "The media to inform the public",
        "Internal incident response team and designated government agencies",
        "All employees via company-wide email"
      ],
      correctAnswer: 2,
      explanation: "Critical infrastructure incidents require immediate notification of internal response teams and designated government agencies (like CISA). This ensures proper coordination and support while maintaining operational security."
    }
  ];

  constructor() {
    this.userProgress = this.loadUserProgress();
    this.updateStreak();
  }

  private loadUserProgress(): UserProgress {
    const stored = localStorage.getItem('opswatSecurityProgress');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      streakCount: 0,
      correctAnswers: 0,
      insightsRead: 0,
      lastVisit: ''
    };
  }

  private saveUserProgress(): void {
    localStorage.setItem('opswatSecurityProgress', JSON.stringify(this.userProgress));
  }

  private updateStreak(): void {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (this.userProgress.lastVisit === today) {
      // Already visited today, maintain streak
    } else if (this.userProgress.lastVisit === yesterday) {
      // Visited yesterday, increment streak
      this.userProgress.streakCount++;
      this.userProgress.lastVisit = today;
    } else if (this.userProgress.lastVisit === '') {
      // First visit
      this.userProgress.streakCount = 1;
      this.userProgress.lastVisit = today;
    } else {
      // Missed a day, reset streak
      this.userProgress.streakCount = 1;
      this.userProgress.lastVisit = today;
    }
    
    this.saveUserProgress();
    this.updateProgressDisplay();
  }

  private updateProgressDisplay(): void {
    const streakElement = document.getElementById('streakCount');
    const scoreElement = document.getElementById('quizScore');
    const insightsElement = document.getElementById('tipsRead');

    if (streakElement) streakElement.textContent = this.userProgress.streakCount.toString();
    if (scoreElement) scoreElement.textContent = this.userProgress.correctAnswers.toString();
    if (insightsElement) insightsElement.textContent = this.userProgress.insightsRead.toString();
  }

  public displayCurrentDate(): void {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
      const today = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
  }

  public showDailyInsight(): void {
    const today = new Date();
    const insightIndex = today.getDate() % this.securityInsights.length;
    const insight = this.securityInsights[insightIndex];
    
    const categoryElement = document.getElementById('tipCategory');
    const contentElement = document.getElementById('dailyTip');
    
    if (categoryElement) categoryElement.textContent = insight.category;
    if (contentElement) contentElement.textContent = insight.content;
  }

  public getNewInsight(): void {
    const randomIndex = Math.floor(Math.random() * this.securityInsights.length);
    const insight = this.securityInsights[randomIndex];
    
    const categoryElement = document.getElementById('tipCategory');
    const contentElement = document.getElementById('dailyTip');
    
    if (categoryElement) categoryElement.textContent = insight.category;
    if (contentElement) contentElement.textContent = insight.content;
    
    this.userProgress.insightsRead++;
    this.saveUserProgress();
    this.updateProgressDisplay();
  }

  public showDailyQuestion(): void {
    const today = new Date();
    const questionIndex = today.getDate() % this.securityQuestions.length;
    this.currentQuestion = this.securityQuestions[questionIndex];
    this.displayQuestion();
  }

  public getNewQuestion(): void {
    const randomIndex = Math.floor(Math.random() * this.securityQuestions.length);
    this.currentQuestion = this.securityQuestions[randomIndex];
    this.selectedAnswer = null;
    
    // Reset UI
    const feedback = document.getElementById('feedback');
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    const nextBtn = document.getElementById('nextQuizBtn');
    
    if (feedback) feedback.style.display = 'none';
    if (submitBtn) submitBtn.disabled = true;
    if (nextBtn) nextBtn.style.display = 'none';
    
    this.displayQuestion();
  }

  private displayQuestion(): void {
    if (!this.currentQuestion) return;

    const questionElement = document.getElementById('quizQuestion');
    const optionsElement = document.getElementById('quizOptions');
    
    if (questionElement) questionElement.textContent = this.currentQuestion.question;
    
    if (optionsElement) {
      optionsElement.innerHTML = '';
      this.currentQuestion.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => this.selectOption(index);
        optionsElement.appendChild(optionDiv);
      });
    }
  }

  public selectOption(index: number): void {
    this.selectedAnswer = index;
    
    // Update UI to show selection
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((option, i) => {
      option.classList.remove('selected');
      if (i === index) {
        option.classList.add('selected');
      }
    });
    
    // Enable submit button
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    if (submitBtn) submitBtn.disabled = false;
  }

  public submitAnswer(): void {
    if (this.selectedAnswer === null || !this.currentQuestion) return;

    const isCorrect = this.selectedAnswer === this.currentQuestion.correctAnswer;
    const feedback = document.getElementById('feedback');
    const submitBtn = document.getElementById('submitBtn');
    const nextBtn = document.getElementById('nextQuizBtn');
    const options = document.querySelectorAll('.quiz-option');

    // Show correct/incorrect styling
    options.forEach((option, index) => {
      if (index === this.currentQuestion!.correctAnswer) {
        option.classList.add('correct');
      } else if (index === this.selectedAnswer) {
        option.classList.add('incorrect');
      }
    });

    // Show feedback
    if (feedback) {
      feedback.style.display = 'block';
      feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
      feedback.textContent = `${isCorrect ? '✅ Correct!' : '❌ Incorrect.'} ${this.currentQuestion.explanation}`;
    }

    // Update progress
    if (isCorrect) {
      this.userProgress.correctAnswers++;
      this.saveUserProgress();
      this.updateProgressDisplay();
    }

    // Hide submit button, show next button
    if (submitBtn) submitBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'inline-block';
  }

  public initialize(): void {
    this.displayCurrentDate();
    this.showDailyInsight();
    this.showDailyQuestion();
    this.updateProgressDisplay();
  }
}

// Global app instance
const opswatApp = new OPSWATSecurityApp();

// Global functions for HTML onclick handlers
(window as any).getNewTip = () => opswatApp.getNewInsight();
(window as any).getNewQuiz = () => opswatApp.getNewQuestion();
(window as any).submitAnswer = () => opswatApp.submitAnswer();

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🛡️ OPSWAT Security Awareness Training loaded!');
  opswatApp.initialize();
});

export { OPSWATSecurityApp }; 