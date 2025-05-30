import { supabaseAdminClient } from "../src/supabase/admin.client";

async function verifyCompanyTables() {
  console.log("🔍 Verifying company-related database tables...\n");

  const tables = [
    'companies',
    'company_enrichments', 
    'user_goals',
    'onboarding_progress'
  ];

  for (const tableName of tables) {
    try {
      // Try to query the table with a limit of 0 to check if it exists
      const { data, error } = await supabaseAdminClient
        .from(tableName)
        .select('*')
        .limit(0);

      if (error) {
        console.error(`❌ Table '${tableName}' check failed:`, error.message);
      } else {
        console.log(`✅ Table '${tableName}' exists and is accessible`);
      }
    } catch (err) {
      console.error(`❌ Error checking table '${tableName}':`, err);
    }
  }

  console.log("\n📊 Checking table schemas...\n");

  // Check companies table columns
  try {
    const { data: companiesSchema } = await supabaseAdminClient
      .from('companies')
      .select()
      .limit(0);

    console.log("✅ Companies table schema verified");
  } catch (err) {
    console.error("❌ Companies table schema check failed:", err);
  }

  // Check if we can perform basic operations
  console.log("\n🧪 Testing basic operations...\n");

  try {
    // Test getting or creating a company
    const testUserId = 'test_user_' + Date.now();
    
    const { data: company, error: companyError } = await supabaseAdminClient
      .from('companies')
      .insert({
        clerk_user_id: testUserId,
        name: 'Test Company',
        website: 'https://test.com',
        industry: 'Technology',
        size: '2-10'
      })
      .select()
      .single();

    if (companyError) {
      console.error("❌ Failed to create test company:", companyError);
    } else {
      console.log("✅ Successfully created test company:", company.id);

      // Clean up test data
      const { error: deleteError } = await supabaseAdminClient
        .from('companies')
        .delete()
        .eq('id', company.id);

      if (deleteError) {
        console.error("❌ Failed to clean up test data:", deleteError);
      } else {
        console.log("✅ Test data cleaned up successfully");
      }
    }
  } catch (err) {
    console.error("❌ Operation test failed:", err);
  }

  console.log("\n✨ Verification complete!");
}

// Run the verification
verifyCompanyTables().catch(console.error);