import { User } from 'react-native-gifted-chat'
import Stripe from 'stripe'

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Sale = Database['public']['Tables']['sales']['Row']
export type Like = Database['public']['Tables']['listing_likes']['Row']
export type View = Database['public']['Tables']['listing_views']['Row']
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type Chat = Database['public']['Tables']['chats']['Row']
export type Listing = Database['public']['Tables']['listings']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']

export interface Database {
	public: {
		Tables: {
			chat_messages: {
				Row: {
					id: number
					created_at: string | null
					chat_id: number | null
					text: string | null
					user: User | null
					from_user_id: string | null
					to_user_id: string | null
					_id: string | null
				}
				Insert: {
					id?: number
					created_at?: string | null
					chat_id?: number | null
					text?: string | null
					user?: User | null
					from_user_id?: string | null
					to_user_id?: string | null
					_id?: string | null
				}
				Update: {
					id?: number
					created_at?: string | null
					chat_id?: number | null
					text?: string | null
					user?: User | null
					from_user_id?: string | null
					to_user_id?: string | null
					_id?: string | null
				}
			}
			chats: {
				Row: {
					id: number
					created_at: string | null
					updated_at: string | null
					last_message: string | null
					listing_id: string | null
					user_1: string | null
					user_2: string | null
					users: string[] | null
				}
				Insert: {
					id?: number
					created_at?: string | null
					updated_at?: string | null
					last_message?: string | null
					listing_id?: string | null
					user_1?: string | null
					user_2?: string | null
					users?: string[] | null
				}
				Update: {
					id?: number
					created_at?: string | null
					updated_at?: string | null
					last_message?: string | null
					listing_id?: string | null
					user_1?: string | null
					user_2?: string | null
					users?: string[] | null
				}
			}
			listing_likes: {
				Row: {
					id: number
					created_at: string | null
					listing_id: string | null
					user_id: string | null
				}
				Insert: {
					id?: number
					created_at?: string | null
					listing_id?: string | null
					user_id?: string | null
				}
				Update: {
					id?: number
					created_at?: string | null
					listing_id?: string | null
					user_id?: string | null
				}
			}
			listing_views: {
				Row: {
					id: number
					created_at: string | null
					listing_id: string | null
					user_id: string | null
				}
				Insert: {
					id?: number
					created_at?: string | null
					listing_id?: string | null
					user_id?: string | null
				}
				Update: {
					id?: number
					created_at?: string | null
					listing_id?: string | null
					user_id?: string | null
				}
			}
			listings: {
				Row: {
					id: string
					created_at: string | null
					updated_at: string | null
					title: string | null
					description: string | null
					brand: string | null
					color: string | null
					condition: string | null
					free_shipping: boolean | null
					images: string[] | null
					likes: number | null
					price: number | null
					shipping_cost: number | null
					ships_from: string | null
					sold_at: string | null
					tags: string[] | null
					type: string | null
					views: number | null
					status: string | null
					user_id: string | null
				}
				Insert: {
					id?: string
					created_at?: string | null
					updated_at?: string | null
					title?: string | null
					description?: string | null
					brand?: string | null
					color?: string | null
					condition?: string | null
					free_shipping?: boolean | null
					images?: string[] | null
					likes?: number | null
					price?: number | null
					shipping_cost?: number | null
					ships_from?: string | null
					sold_at?: string | null
					tags?: string[] | null
					type?: string | null
					views?: number | null
					status?: string | null
					user_id?: string | null
				}
				Update: {
					id?: string
					created_at?: string | null
					updated_at?: string | null
					title?: string | null
					description?: string | null
					brand?: string | null
					color?: string | null
					condition?: string | null
					free_shipping?: boolean | null
					images?: string[] | null
					likes?: number | null
					price?: number | null
					shipping_cost?: number | null
					ships_from?: string | null
					sold_at?: string | null
					tags?: string[] | null
					type?: string | null
					views?: number | null
					status?: string | null
					user_id?: string | null
				}
			}
			profiles: {
				Row: {
					id: string
					created_at: string | null
					updated_at: string | null
					merchant_id: string | null
					fast_responder: boolean | null
					quick_shipper: boolean | null
					reliable: boolean | null
					description: string | null
					email: string | null
					first_name: string | null
					last_name: string | null
					image_url: string | null
					setup_complete: boolean | null
					username: string | null
					customer_id: string | null
				}
				Insert: {
					id: string
					created_at?: string | null
					updated_at?: string | null
					merchant_id?: string | null
					fast_responder?: boolean | null
					quick_shipper?: boolean | null
					reliable?: boolean | null
					description?: string | null
					email?: string | null
					first_name?: string | null
					last_name?: string | null
					image_url?: string | null
					setup_complete?: boolean | null
					username?: string | null
					customer_id?: string | null
				}
				Update: {
					id?: string
					created_at?: string | null
					updated_at?: string | null
					merchant_id?: string | null
					fast_responder?: boolean | null
					quick_shipper?: boolean | null
					reliable?: boolean | null
					description?: string | null
					email?: string | null
					first_name?: string | null
					last_name?: string | null
					image_url?: string | null
					setup_complete?: boolean | null
					username?: string | null
					customer_id?: string | null
				}
			}
			reviews: {
				Row: {
					id: number
					created_at: string | null
					rating: number | null
					comment: string | null
					feedback: string[] | null
					reviewer_id: string | null
					reviewee_id: string | null
					transaction: 'buy' | 'sell' | null
					sale_id: string | null
				}
				Insert: {
					id?: number
					created_at?: string | null
					rating?: number | null
					comment?: string | null
					feedback?: string[] | null
					reviewer_id?: string | null
					reviewee_id?: string | null
					transaction?: 'buy' | 'sell' | null
					sale_id?: string | null
				}
				Update: {
					id?: number
					created_at?: string | null
					rating?: number | null
					comment?: string | null
					feedback?: string[] | null
					reviewer_id?: string | null
					reviewee_id?: string | null
					transaction?: 'buy' | 'sell' | null
					sale_id?: string | null
				}
			}
			sales: {
				Row: {
					id: number
					created_at: string | null
					updated_at: string | null
					price: number | null
					payment_id: string | null
					listing_id: string | null
					buyer_id: string | null
					seller_id: string | null
					status: 'awaiting shipping' | 'shipped' | 'delivered' | 'complete' | 'error' | null
					shipping_price: number | null
					tracking_number: string | null
					customer_id: string | null
					merchant_id: string | null
					buyer_rated_at: string | null
					seller_rated_at: string | null
					shipped_at: string | null
					delivered_at: string | null
					completed_at: string | null
					shipping_address: Stripe.Customer.Shipping | null
				}
				Insert: {
					id?: number
					created_at?: string | null
					updated_at?: string | null
					price?: number | null
					payment_id?: string | null
					listing_id?: string | null
					buyer_id?: string | null
					seller_id?: string | null
					status?: 'awaiting shipping' | 'shipped' | 'delivered' | 'complete' | 'error' | null
					shipping_price?: number | null
					tracking_number?: string | null
					customer_id?: string | null
					merchant_id?: string | null
					buyer_rated_at?: string | null
					seller_rated_at?: string | null
					shipped_at?: string | null
					delivered_at?: string | null
					completed_at?: string | null
					shipping_address?: Stripe.Customer.Shipping | null
				}
				Update: {
					id?: number
					created_at?: string | null
					updated_at?: string | null
					price?: number | null
					payment_id?: string | null
					listing_id?: string | null
					buyer_id?: string | null
					seller_id?: string | null
					status?: 'awaiting shipping' | 'shipped' | 'delivered' | 'complete' | 'error' | null
					shipping_price?: number | null
					tracking_number?: string | null
					customer_id?: string | null
					merchant_id?: string | null
					buyer_rated_at?: string | null
					seller_rated_at?: string | null
					shipped_at?: string | null
					delivered_at?: string | null
					completed_at?: string | null
					shipping_address?: Stripe.Customer.Shipping | null
				}
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
	}
}
