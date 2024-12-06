interface StructureAnalysis {
  isValid: boolean;
  sections: string[];
  missingComponents: string[];
}

export function analyzeStructure(content: string): StructureAnalysis {
  const requiredComponents = ['Objective:', 'Prompt:', 'Outcome:'];
  const sections = content.split(/Prompt\s*\[\d+\]:/i).slice(1);
  
  const missingComponents = requiredComponents.filter(component => 
    !content.includes(component)
  );

  return {
    isValid: missingComponents.length === 0 && sections.length > 0,
    sections: sections.map(s => s.trim()),
    missingComponents
  };
}