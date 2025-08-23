const XLSX = require('xlsx');

// Create a test file with known discrepancies
function createTestWithDiscrepancies() {
  console.log('📝 Creating test file with known discrepancies...');
  
  // Drug data with known issues that should trigger discrepancies
  const testData = [
    {
      'Drug Name': 'Amoxicillin',
      'Strength': '500 mg',
      'Formulation': 'Capsule',
      'Unit Price': 0.60, // 33% higher than reference $0.45 → SHOULD trigger discrepancy
      'Payer': 'medicaid',
      'Quantity': 30
    },
    {
      'Drug Name': 'Lisinopril',
      'Strength': '10 mg',
      'Formulation': 'Capsule', // Different from reference "Tablet" → SHOULD trigger discrepancy
      'Unit Price': 0.30, // Same as reference
      'Payer': 'medicaid',
      'Quantity': 30
    },
    {
      'Drug Name': 'Metformin',
      'Strength': '1000 mg', // Different from reference "500 mg" → SHOULD trigger discrepancy
      'Formulation': 'Tablet (ER)',
      'Unit Price': 0.15, // Same as reference
      'Payer': 'medicare',
      'Quantity': 60
    },
    {
      'Drug Name': 'Simvastatin',
      'Strength': '20 mg',
      'Formulation': 'Tablet',
      'Unit Price': 0.35, // 40% higher than reference $0.25 → SHOULD trigger discrepancy
      'Payer': 'medicaid', // Different from reference "medicare" → SHOULD trigger discrepancy
      'Quantity': 30
    },
    {
      'Drug Name': 'Unknown Drug XYZ', // Not in reference data → SHOULD trigger discrepancy
      'Strength': '50 mg',
      'Formulation': 'Tablet',
      'Unit Price': 25.00,
      'Payer': 'medicaid',
      'Quantity': 15
    }
  ];
  
  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(testData);
  
  // Set column widths
  const columnWidths = [
    { wch: 20 }, // Drug Name
    { wch: 15 }, // Strength
    { wch: 20 }, // Formulation
    { wch: 12 }, // Unit Price
    { wch: 12 }, // Payer
    { wch: 10 }  // Quantity
  ];
  worksheet['!cols'] = columnWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Data with Discrepancies');
  
  // Write to file
  const filename = 'test-with-discrepancies.xlsx';
  XLSX.writeFile(workbook, filename);
  
  console.log(`✅ Created test file: ${filename}`);
  console.log(`📊 File contains ${testData.length} drug rows with known issues`);
  
  // Show expected discrepancies
  console.log('\n🎯 Expected discrepancies:');
  console.log('  1. Amoxicillin: Unit price 33% higher than reference');
  console.log('  2. Lisinopril: Formulation mismatch (Capsule vs Tablet)');
  console.log('  3. Metformin: Strength mismatch (1000 mg vs 500 mg)');
  console.log('  4. Simvastatin: Unit price 40% higher + payer mismatch');
  console.log('  5. Unknown Drug XYZ: Reference not found');
  console.log(`\n📈 Expected total: 6+ discrepancies`);
  
  console.log('\n🚀 Upload this file to test discrepancy detection!');
}

// Run the function
try {
  createTestWithDiscrepancies();
  console.log('\n🎉 Test file with discrepancies created successfully!');
} catch (error) {
  console.error('❌ Error creating test file:', error.message);
}
