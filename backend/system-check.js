const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testDatabase() {
  console.log('\n🔍 Testing Database Connection...');
  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');

    // Test create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Test table created successfully');

    // Test insert
    const insertResult = await client.query(
      'INSERT INTO test_table (name) VALUES ($1) RETURNING *',
      ['test_item']
    );
    console.log('✅ Insert operation successful');

    // Test select
    const selectResult = await client.query('SELECT * FROM test_table');
    console.log('✅ Select operation successful');
    console.log(`📊 Records in test table: ${selectResult.rows.length}`);

    // Clean up
    await client.query('DROP TABLE test_table');
    console.log('✅ Test table cleaned up');

    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database test failed:', err.message);
    return false;
  }
}

async function testBackendAPI() {
  console.log('\n🔍 Testing Backend API...');
  const baseUrl = `http://localhost:${process.env.PORT}/api`;
  
  try {
    // Test health endpoint
    console.log('Testing API endpoints...');
    
    // Try different endpoints
    const endpoints = [
      '/perfumes',  // Assuming this is one of your endpoints
      '/categories',
      '/auth/check' // Basic auth check endpoint
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${baseUrl}${endpoint}`);
        console.log(`✅ Endpoint ${endpoint} is responding (Status: ${response.status})`);
      } catch (err) {
        console.log(`ℹ️ Endpoint ${endpoint} returned:`, err.response ? err.response.status : 'No response');
      }
    }

    return true;
  } catch (err) {
    console.error('❌ Backend API test failed:', err.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting System Check...\n');
  
  console.log('📌 Environment Variables:');
  console.log(`- PORT: ${process.env.PORT}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`- Database: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Not Set'}`);
  console.log(`- JWT Secret: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not Set'}`);
  console.log(`- Frontend URL: ${process.env.FRONTEND_URL ? '✅ Set' : '❌ Not Set'}`);
  
  const dbResult = await testDatabase();
  const apiResult = await testBackendAPI();

  console.log('\n📊 Test Summary:');
  console.log(`Database Tests: ${dbResult ? '✅ Passed' : '❌ Failed'}`);
  console.log(`API Tests: ${apiResult ? '✅ Passed' : '❌ Failed'}`);

  pool.end();
}

runAllTests().catch(console.error);
