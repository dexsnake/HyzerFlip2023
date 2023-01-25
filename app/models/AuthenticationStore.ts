import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { Session, User } from '@supabase/supabase-js'
import { SessionModel } from './Session'
import { UserModel } from './User'

export const AuthenticationStoreModel = types
	.model('AuthenticationStore')
	.props({
		token: types.maybe(types.string),
		authEmail: '',
		authPassword: ''
	})
	.views((store) => ({
		get isAuthenticated() {
			return !!store.token
		},
		get validationErrors() {
			return {
				authEmail: (function () {
					if (store.authEmail.length === 0) return "can't be blank"
					if (store.authEmail.length < 6) return 'must be at least 6 characters'
					if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail)) return 'must be a valid email address'
					return ''
				})(),
				authPassword: (function () {
					if (store.authPassword.length === 0) return "can't be blank"
					if (store.authPassword.length < 6) return 'must be at least 6 characters'
					return ''
				})()
			}
		}
	}))
	.actions((store) => ({
		setToken(value?: string) {
			store.token = value
		},
		setAuthEmail(value: string) {
			store.authEmail = value.replace(/ /g, '')
		},
		setAuthPassword(value: string) {
			store.authPassword = value.replace(/ /g, '')
		},
		logout() {
			store.token = null
			store.authEmail = ''
			store.authPassword = ''
		}
	}))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
