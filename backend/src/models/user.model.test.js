import assert from 'node:assert/strict'
import test from 'node:test'
import pool from '../config/db.js'
import { getUserProfile } from './user.model.js'

test('loads the profile image through the checked-in profile procedure', async () => {
    const originalQuery = pool.query
    const profile = { user_id: 6, profile_image: '/uploads/profile-images/avatar.webp' }
    let queryCall

    pool.query = async (...args) => {
        queryCall = args
        return [[[profile]]]
    }

    try {
        assert.deepEqual(await getUserProfile(6), profile)
        assert.deepEqual(queryCall, ['CALL sp_get_user_profile(?)', [6]])
    } finally {
        pool.query = originalQuery
    }
})
