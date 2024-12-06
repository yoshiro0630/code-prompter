export const generatePreviewHTML = (content: string): string => {
  const prompts = parsePrompts(content);
  const date = new Date().toLocaleDateString();

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BOLT.NEW Prompts</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      :root {
        --gradient-start: #47FFFF;
        --gradient-end: #FF47FF;
        --dark-bg: #1F2937;
        --light-bg: #F9FAFB;
      }
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Poppins', sans-serif;
        line-height: 1.6;
        background: var(--light-bg);
        color: var(--dark-bg);
        padding: 2rem;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .header {
        text-align: center;
        margin-bottom: 3rem;
        padding: 2rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .logo {
        width: 120px;
        height: 120px;
        margin: 0 auto 1rem;
      }
      
      .title {
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
      }
      
      .date {
        color: #6B7280;
        font-size: 0.875rem;
      }
      
      .prompt-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }
      
      .prompt-card {
        background: white;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
      }
      
      .prompt-card:hover {
        transform: translateY(-4px);
      }
      
      .prompt-header {
        padding: 1.5rem;
        background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
        color: white;
      }
      
      .prompt-number {
        font-size: 0.875rem;
        opacity: 0.9;
        margin-bottom: 0.5rem;
      }
      
      .prompt-title {
        font-size: 1.25rem;
        font-weight: 600;
        line-height: 1.4;
      }
      
      .prompt-content {
        padding: 1.5rem;
      }
      
      .prompt-section {
        margin-bottom: 1.5rem;
      }
      
      .prompt-section:last-child {
        margin-bottom: 0;
      }
      
      .section-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #6B7280;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .section-content {
        font-size: 0.9375rem;
        color: var(--dark-bg);
        background: var(--light-bg);
        padding: 1rem;
        border-radius: 0.5rem;
        white-space: pre-wrap;
      }
      
      @media (max-width: 768px) {
        body {
          padding: 1rem;
        }
        
        .prompt-grid {
          grid-template-columns: 1fr;
        }
      }
      
      @media print {
        .prompt-card {
          break-inside: avoid;
          margin-bottom: 2rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header class="header">
        <svg class="logo" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="120" height="120" rx="16" fill="url(#gradient)" />
          <path d="M40 80V40L60 60L80 40V80" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#47FFFF"/>
              <stop offset="100%" stop-color="#FF47FF"/>
            </linearGradient>
          </defs>
        </svg>
        <h1 class="title">BOLT.NEW Prompts</h1>
        <div class="date">Generated on ${date}</div>
      </header>

      <div class="prompt-grid">
        ${prompts.map((prompt, index) => `
          <div class="prompt-card">
            <div class="prompt-header">
              <div class="prompt-number">Prompt ${index + 1}</div>
              <h2 class="prompt-title">${prompt.title}</h2>
            </div>
            <div class="prompt-content">
              <div class="prompt-section">
                <div class="section-title">Objective</div>
                <div class="section-content">${prompt.objective}</div>
              </div>
              <div class="prompt-section">
                <div class="section-title">Prompt</div>
                <div class="section-content">${prompt.prompt}</div>
              </div>
              <div class="prompt-section">
                <div class="section-title">Expected Outcome</div>
                <div class="section-content">${prompt.outcome}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </body>
</html>`;
};

interface ParsedPrompt {
  title: string;
  objective: string;
  prompt: string;
  outcome: string;
}

const parsePrompts = (content: string): ParsedPrompt[] => {
  const prompts: ParsedPrompt[] = [];
  const sections = content.split(/Prompt\s*\[\d+\]:/i);

  sections.slice(1).forEach(section => {
    const titleMatch = section.match(/^([^\n]+)/);
    const objectiveMatch = section.match(/Objective:\s*([^\n]+(?:\n(?!Prompt:)[^\n]+)*)/i);
    const promptMatch = section.match(/Prompt:\s*([^\n]+(?:\n(?!Outcome:)[^\n]+)*)/i);
    const outcomeMatch = section.match(/Outcome:\s*([^\n]+(?:\n(?!Prompt:|\[|$)[^\n]+)*)/i);

    if (titleMatch && objectiveMatch && promptMatch && outcomeMatch) {
      prompts.push({
        title: titleMatch[1].trim(),
        objective: objectiveMatch[1].trim(),
        prompt: promptMatch[1].trim(),
        outcome: outcomeMatch[1].trim()
      });
    }
  });

  return prompts;
};