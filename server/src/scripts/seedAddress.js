import mongoose from 'mongoose'
import { addressService } from '../services/address.service.js'
import { env } from '../config/environment.js'

const seedAddressData = async () => {
    try {
        console.log('🌱 Starting address data seeding...')
        
        // Connect to MongoDB
        await mongoose.connect(env.MONGODB_URI)
        console.log('✅ Connected to MongoDB')
        
        // Seed address data
        await addressService.seedAddressData()
        
        console.log('🎉 Address data seeding completed successfully!')
        
    } catch (error) {
        console.error('❌ Error seeding address data:', error)
        process.exit(1)
    } finally {
        // Close connection
        await mongoose.connection.close()
        console.log('🔌 MongoDB connection closed')
        process.exit(0)
    }
}

// Run the seed function
seedAddressData()
