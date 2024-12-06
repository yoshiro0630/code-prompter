import { ProjectType } from '../../types/questions';
import { ProjectMetrics } from '../../types/project-types';
import { generateLogoPlaceholder } from './logoGenerator';
import { formatSectionContent } from './sectionFormatter';

export const generatePreviewHTML = (
  answers: Record<string, string>,
  projectType: ProjectType,
  metrics: ProjectMetrics
): string => {
  const logo = generateLogoPlaceholder();
  const date = new Date().toLocaleDateString();
  const companyAddress = "123 Tech Park Drive\nSuite 200\nInnovation City, TC 12345";
  const companyDetails = "ABN: 12 345 678 901\nACN: 987 654 321";

  const sections = [
    { title: 'Project Overview', content: answers.question_0 },
    { title: 'Core Features & Functionality', content: answers.question_1 },
    { title: 'User Interface & Experience', content: answers.question_2 },
    { title: 'Technical Architecture', content: answers.question_3 },
    { title: 'Data & Storage', content: answers.question_4 },
    { title: 'Security & Compliance', content: answers.question_5 },
    { title: 'Development Approach', content: answers.question_6 },
    { title: 'Timeline & Milestones', content: answers.question_7 }
  ];

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project Requirements Document</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 2rem;
            background: #f9fafb;
            color: #111827;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #f3f4f6;
          }
          .logo {
            width: 120px;
            height: auto;
          }
          .company-info {
            text-align: right;
            white-space: pre-line;
            color: #4b5563;
            font-size: 0.875rem;
          }
          h1, h2, h3 {
            color: #111827;
            margin-top: 0;
          }
          h1 {
            font-size: 2.25rem;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, #47FFFF 0%, #FF47FF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
          }
          h2 {
            font-size: 1.5rem;
            margin: 2rem 0 1rem;
            color: #1f2937;
          }
          p {
            color: #4b5563;
            line-height: 1.6;
            margin: 1rem 0;
          }
          .section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #f9fafb;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }
          .section h2 {
            margin-top: 0;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e5e7eb;
          }
          .costs {
            margin-top: 2rem;
            padding: 1.5rem;
            background: linear-gradient(135deg, #47FFFF 0%, #FF47FF 100%);
            border-radius: 6px;
            color: white;
          }
          .costs h2 {
            color: white;
            margin-top: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          .cost-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            padding: 0.5rem 0;
          }
          .total-cost {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 2px solid rgba(255, 255, 255, 0.2);
            font-size: 1.25rem;
            font-weight: bold;
          }
          .action-buttons {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            display: flex;
            gap: 1rem;
            z-index: 100;
          }
          .action-button {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: opacity 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'Poppins', sans-serif;
          }
          .primary-button {
            background: linear-gradient(135deg, #47FFFF 0%, #FF47FF 100%);
            color: white;
          }
          .secondary-button {
            background: white;
            color: #111827;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }
          .quick-nav {
            position: fixed;
            left: 2rem;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .quick-nav a {
            display: block;
            padding: 0.5rem 1rem;
            color: #4b5563;
            text-decoration: none;
            font-size: 0.875rem;
            transition: all 0.2s;
            border-radius: 0.25rem;
          }
          .quick-nav a:hover {
            background: #f3f4f6;
            color: #111827;
          }
          @media print {
            .action-buttons, .quick-nav {
              display: none;
            }
            body {
              padding: 0;
              background: white;
            }
            .container {
              box-shadow: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logo}" alt="Company Logo" class="logo">
            <div class="company-info">
              <div>${companyAddress}</div>
              <div>${companyDetails}</div>
              <div>Date: ${date}</div>
            </div>
          </div>

          <h1>${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project Requirements</h1>

          <div class="content">
            ${sections.map((section, index) => `
              <div class="section" id="section-${index}">
                <h2>${section.title}</h2>
                ${formatSectionContent(section.content)}
              </div>
            `).join('')}
          </div>

          <div class="costs">
            <h2>Project Investment</h2>
            ${Object.entries(metrics.costs)
              .filter(([key]) => key !== 'total' && key !== 'contingency')
              .map(([key, value]) => `
                <div class="cost-item">
                  <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span>$${value.toLocaleString()}</span>
                </div>
              `).join('')}
            <div class="cost-item">
              <span>Contingency (15%)</span>
              <span>$${metrics.costs.contingency.toLocaleString()}</span>
            </div>
            <div class="cost-item total-cost">
              <span>Total Investment</span>
              <span>$${metrics.costs.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="quick-nav">
          ${sections.map((section, index) => `
            <a href="#section-${index}">${section.title}</a>
          `).join('')}
        </div>

        <div class="action-buttons">
          <button onclick="window.print()" class="action-button secondary-button">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Export PDF
          </button>
          <button onclick="window.location.href='https://docs.google.com'" class="action-button primary-button">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Open in Google Docs
          </button>
        </div>
      </body>
    </html>`;
};