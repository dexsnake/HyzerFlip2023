import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Database } from '../../types'

const supabaseUrl = 'https://aafktweulzsqybgmtqga.supabase.co'
const supabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhZmt0d2V1bHpzcXliZ210cWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk4MTI1NzEsImV4cCI6MTk2NTM4ODU3MX0.WuJgYnruZGSG0DOQsVQEC_50rcosp47-guZtNtG5ejM'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false
	}
})
