export const formatSectionContent = (content: string): string => {
  return content
    .split('\n')
    .map(line => {
      if (line.startsWith('- ')) {
        return `<li class="ml-4 text-gray-700">${line.substring(2)}</li>`;
      }
      if (line.startsWith('## ')) {
        return `<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">${line.substring(3)}</h3>`;
      }
      if (line.startsWith('### ')) {
        return `<h4 class="text-md font-medium text-gray-800 mt-3 mb-2">${line.substring(4)}</h4>`;
      }
      if (line.trim()) {
        return `<p class="text-gray-700 leading-relaxed">${line}</p>`;
      }
      return '';
    })
    .join('\n');
};