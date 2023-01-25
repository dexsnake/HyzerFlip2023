import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'

export const UserModel = types.model({
	id: types.string,
	aud: types.string,
	role: types.string,
	email: types.string,
	email_confirmed_at: types.string,
	phone: types.string,
	confirmed_at: types.string,
	last_sign_in_at: types.string,
	app_metadata: types.model({
		provider: types.string,
		providers: types.array(types.string)
	}),
	user_metadata: types.model({}),
	identities: types.array(
		types.model({
			id: types.string,
			user_id: types.string,
			identity_data: types.model({
				email: types.string,
				sub: types.string
			}),
			provider: types.string,
			last_sign_in_at: types.string,
			created_at: types.string,
			updated_at: types.string
		})
	),
	created_at: types.string,
	updated_at: types.string
})

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
