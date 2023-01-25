import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import { UserModel } from './User'

export const SessionModel = types.model({
	access_token: types.string,
	token_type: types.string,
	expires_in: types.number,
	refresh_token: types.string,
	expires_at: types.number,
	user: types.map(UserModel)
})

export interface Session extends Instance<typeof SessionModel> {}
export interface SessionSnapshotOut extends SnapshotOut<typeof SessionModel> {}
export interface SessionSnapshotIn extends SnapshotIn<typeof SessionModel> {}
