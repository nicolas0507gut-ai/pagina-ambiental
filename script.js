* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  background: #f4fbf6;
  color: #18352a;
  line-height: 1.6;
}

a {
  text-decoration: none;
}

.hero {
  min-height: 100vh;
  background:
    linear-gradient(rgba(10, 77, 54, 0.83), rgba(10, 77, 54, 0.83)),
    radial-gradient(circle at top left, #70d68b, #0b4d36);
  color: white;
  padding: 20px;
}

.navbar {
  max-width: 1150px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.logo {
  font-size: 26px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 22px;
}

.nav-links a {
  color: white;
  font-weight: bold;
  font-size: 15px;
}

.nav-links a:hover {
  color: #c9ffd7;
}

.hero-content {
  max-width: 1150px;
  margin: 90px auto 0;
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 40px;
  align-items: center;
}

.tag {
  display: inline-block;
  background: #dfffe8;
  color: #0b4d36;
  padding: 8px 14px;
  border-radius: 50px;
  font-weight: bold;
  margin-bottom: 18px;
}

.hero h1 {
  font-size: 54px;
  line-height: 1.1;
  margin-bottom: 20px;
}

.hero p {
  font-size: 18px;
  max-width: 650px;
}

.hero-buttons {
  margin-top: 30px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 22px;
  border-radius: 50px;
  font-weight: bold;
  display: inline-block;
}

.primary {
  background: #9be15d;
  color: #163a28;
}

.secondary {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.hero-card {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 30px;
  border-radius: 25px;
  backdrop-filter: blur(8px);
}

.hero-card h3 {
  font-size: 24px;
  margin-bottom: 18px;
}

.hero-card p {
  font-size: 16px;
  margin-bottom: 12px;
}

.section {
  max-width: 1150px;
  margin: auto;
  padding: 80px 20px;
}

.soft-bg {
  max-width: none;
  background: #e8f8ed;
  padding-left: calc((100% - 1150px) / 2 + 20px);
  padding-right: calc((100% - 1150px) / 2 + 20px);
}

.section-title {
  text-align: center;
  margin-bottom: 45px;
}

.section-title span {
  color: #16854e;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1px;
}

.section-title h2 {
  font-size: 38px;
  margin: 10px 0;
  color: #123527;
}

.section-title p {
  max-width: 760px;
  margin: auto;
  color: #496558;
}

.section-title.light h2,
.section-title.light p,
.section-title.light span {
  color: white;
}

.info-grid,
.problem-grid,
.stats-grid,
.missions-grid,
.reuse-grid {
  display: grid;
  gap: 24px;
}

.info-grid {
  grid-template-columns: repeat(3, 1fr);
}

.problem-grid {
  grid-template-columns: repeat(2, 1fr);
}

.stats-grid {
  grid-template-columns: repeat(4, 1fr);
}

.missions-grid {
  grid-template-columns: repeat(3, 1fr);
}

.reuse-grid {
  grid-template-columns: repeat(4, 1fr);
}

.info-card,
.problem-card,
.stat-card,
.mission-card,
.reuse-grid article,
.quiz-card {
  background: white;
  border-radius: 22px;
  padding: 26px;
  box-shadow: 0 10px 25px rgba(21, 77, 53, 0.08);
}

.icon {
  font-size: 38px;
  margin-bottom: 15px;
}

.info-card h3,
.problem-card h3,
.mission-card h3,
.reuse-grid h3 {
  margin-bottom: 12px;
  color: #123527;
}

.problem-card {
  position: relative;
  overflow: hidden;
}

.problem-number {
  font-size: 48px;
  font-weight: bold;
  color: #d7f3df;
  margin-bottom: 10px;
}

.stat-card {
  text-align: center;
  border-top: 6px solid #30a46c;
}

.stat-card h3 {
  font-size: 34px;
  color: #16854e;
  margin-bottom: 10px;
}

.impact-list {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.impact-list article {
  background: #ffffff;
  border-left: 6px solid #f4c542;
  padding: 24px;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(21, 77, 53, 0.08);
}

.impact-list h3 {
  color: #123527;
  margin-bottom: 10px;
}

.missions-section {
  max-width: none;
  background: linear-gradient(135deg, #0b4d36, #16854e);
  color: white;
  padding-left: calc((100% - 1150px) / 2 + 20px);
  padding-right: calc((100% - 1150px) / 2 + 20px);
}

.progress-panel {
  background: white;
  color: #123527;
  padding: 25px;
  border-radius: 24px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1fr 1.4fr 2fr;
  gap: 20px;
  align-items: center;
}

.small-text {
  font-size: 14px;
  color: #658173;
  font-weight: bold;
}

#score {
  font-size: 40px;
  color: #16854e;
}

#badge {
  font-size: 24px;
  color: #123527;
}

.progress-bar {
  width: 100%;
  height: 14px;
  background: #d9eadf;
  border-radius: 30px;
  overflow: hidden;
}

#progressFill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #9be15d, #16854e);
  border-radius: 30px;
  transition: width 0.4s ease;
}

.mission-card {
  color: #123527;
}

.mission-card button,
.quiz-option,
#commitmentBtn,
.reset-btn {
  width: 100%;
  margin-top: 18px;
  padding: 13px 16px;
  border: none;
  border-radius: 14px;
  background: #16854e;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
}

.mission-card button:hover,
.quiz-option:hover,
#commitmentBtn:hover {
  background: #0b4d36;
  transform: translateY(-2px);
}

.mission-card button.completed {
  background: #a8b7ad;
  cursor: not-allowed;
}

.quiz-card {
  color: #123527;
  margin-top: 28px;
}

.quiz-card h3 {
  margin-bottom: 10px;
}

.quiz-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.quiz-option {
  margin-top: 15px;
}

.quiz-option.correct {
  background: #16854e;
}

.quiz-option.wrong {
  background: #d9534f;
}

#quizMessage {
  margin-top: 15px;
  font-weight: bold;
}

.reset-btn {
  max-width: 230px;
  display: block;
  margin: 25px auto 0;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.reuse-grid article {
  text-align: center;
}

.commitment {
  margin: 40px auto 80px;
  max-width: 900px;
  background: #123527;
  color: white;
  text-align: center;
  padding: 55px 30px;
  border-radius: 30px;
}

.commitment h2 {
  font-size: 36px;
  margin-bottom: 15px;
}

.commitment p {
  max-width: 650px;
  margin: auto;
}

#commitmentBtn {
  max-width: 260px;
  margin: 25px auto 0;
  background: #9be15d;
  color: #123527;
}

#commitmentMessage {
  margin-top: 18px;
  font-weight: bold;
  color: #dfffe8;
}

footer {
  text-align: center;
  background: #0b4d36;
  color: white;
  padding: 25px;
}

#toast {
  position: fixed;
  bottom: 25px;
  right: 25px;
  background: #123527;
  color: white;
  padding: 16px 20px;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.18);
  opacity: 0;
  pointer-events: none;
  transition: 0.3s ease;
  z-index: 999;
}

#toast.show {
  opacity: 1;
}

@media (max-width: 900px) {
  .hero-content {
    grid-template-columns: 1fr;
    margin-top: 50px;
  }

  .hero h1 {
    font-size: 38px;
  }

  .nav-links {
    display: none;
  }

  .info-grid,
  .problem-grid,
  .stats-grid,
  .missions-grid,
  .reuse-grid,
  .impact-list,
  .progress-panel,
  .quiz-options {
    grid-template-columns: 1fr;
  }

  .section-title h2 {
    font-size: 30px;
  }
}
