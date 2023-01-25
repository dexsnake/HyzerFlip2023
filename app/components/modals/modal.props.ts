import { NavigationProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

export interface ModalProps {
	/**
	 * Variable that controls the open and close state of the modal
	 */
	isModalOpen: boolean

	/**
	 * Function that controls closing the modal
	 */
	handleModalClose(): void

	/**
	 * An object with methods to call within the functions
	 */
	[actions: string]: any
	navigation?: StackNavigationProp<any> | NavigationProp<any>
}
