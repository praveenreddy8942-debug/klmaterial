// Local materials data - Update this when adding new materials
export interface Material {
  name: string;
  displayName: string;
  download_url: string;
  size: string;
  category: string;
}

export const materialsData: Material[] = [
  // BEEC Materials
  {
    name: 'BEEC_Updated_CO1&2.pdf',
    displayName: 'BEEC Updated CO1&2',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/BEEC/BEEC%20Updated%20CO1%20%26%20CO2%20Notes_unlocked.pdf',
    size: '2.5 MB',
    category: 'BEEC'
  },
  {
    name: 'BEEC_Updated_CO3&4_unlocked.pdf',
    displayName: 'BEEC Updated CO3&4 unlocked',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/BEEC/BEEC%20Updated%20CO3%20%26%20CO4%20Notes_unlocked.pdf',
    size: '3.1 MB',
    category: 'BEEC'
  },

  // DM Materials
  {
    name: 'DM_CO-1_material.pdf',
    displayName: 'DM CO-1 material',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/DM/DM%20CO-1%20Material_efecb4d79b6e84268fcdc4dc92ae43f9.pdf',
    size: '1.8 MB',
    category: 'DM'
  },
  {
    name: 'DM_CO-2_material.pdf',
    displayName: 'DM CO-2 material',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/DM/DM%20CO-2%20Material_df4a0e9c5868f21e1ff8422bc06a9e58.pdf',
    size: '2.0 MB',
    category: 'DM'
  },
  {
    name: 'DM_CO-3_material.pdf',
    displayName: 'DM CO-3 material',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/DM/DM%20CO-3%20Material_884f340d5afd6fb948de6395d7297e02.pdf',
    size: '1.9 MB',
    category: 'DM'
  },
  {
    name: 'DM_CO-4_material.pdf',
    displayName: 'DM CO-4 material',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/DM/CO_4_Material_1bbf75bb8a3be89c7e1b47d157fd6b2f.pdf',
    size: '2.2 MB',
    category: 'DM'
  },

  // DSD Materials
  {
    name: 'DSD_CO1_NOTES.pdf',
    displayName: 'DSD CO1 Terminal Q&A',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/DSD/DSD%20CO-1%20terminal%20questions%20and%20answers.pdf',
    size: '1.5 MB',
    category: 'DSD'
  },
  {
    name: 'DSD_CO2_NOTES.pdf',
    displayName: 'DSD CO2 Terminal Questions',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/DSD/DSD%20CO-2%20Terminal%20Questions.pdf',
    size: '1.7 MB',
    category: 'DSD'
  },
  {
    name: 'DSD_CO3_NOTES.pdf',
    displayName: 'DSD CO3 NOTES',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/DSD/DSD%20CO3%20Notes.pdf',
    size: '1.6 MB',
    category: 'DSD'
  },
  {
    name: 'DSD_CO4_NOTES.pdf',
    displayName: 'DSD CO4 NOTES',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/DSD/DSD%20CO4%20Notes.pdf',
    size: '1.8 MB',
    category: 'DSD'
  },
  {
    name: 'DSD_CO4_last_topics.pdf',
    displayName: 'DSD CO4 Last Topics',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/DSD/DSD%20CO-4%20last%20topics.pdf',
    size: '0.9 MB',
    category: 'DSD'
  },

  // PSC Materials
  {
    name: 'PSC_basics_and_syntax.pdf',
    displayName: 'PSC Basics and Syntax',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/PSC/PSC%20basics%20and%20syntax.pdf',
    size: '1.2 MB',
    category: 'PSC'
  },
  {
    name: 'PSC_FULL_NOTES.pdf',
    displayName: 'PSC FULL NOTES',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/PSC/PSC%20FULL_NOTES.pdf',
    size: '4.5 MB',
    category: 'PSC'
  },
  {
    name: 'PSC_Full_Notes_2.pdf',
    displayName: 'PSC Full Notes 2',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/PSC/PSC%20Full%20Notes%202.pdf',
    size: '133 MB',
    category: 'PSC'
  },
  {
    name: 'PSC_CO1_Material.docx',
    displayName: 'PSC CO-1 Material',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/PSC/PSC%20CO-1%20Material.docx',
    size: '140 KB',
    category: 'PSC'
  },
  {
    name: 'PSC_CO3_Important_Questions.docx',
    displayName: 'PSC CO3 Important Questions',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/PSC/PSC%20C03%20Important%20Questions.docx',
    size: '1.6 MB',
    category: 'PSC'
  },
  {
    name: 'PSC_CO4_Important_Questions.docx',
    displayName: 'PSC CO4 Important Questions',
    download_url: 'https://github.com/praveenreddy8942-debug/klmaterial/raw/main/materials/PSC/PSC%20Co4%20Important%20Questions.docx',
    size: '110 KB',
    category: 'PSC'
  },
];

export const SUBJECTS: Record<string, string> = {
  'BEEC': 'Basic Electrical & Electronic Circuits (BEEC)',
  'DM': 'Discrete Mathematics (DM)',
  'PSC': 'Programming for Problem Solving using C (PSC)',
  'DSD': 'Digital System Design (DSD)',
};
