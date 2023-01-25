import { formatDistanceToNow } from 'date-fns'
import React, { useRef } from 'react'
import { Image, View, ViewStyle, Text, TextStyle } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { spacing } from '../../theme'
import { Listing } from '../../../types'
import { screenWidth } from '../../utils/screen-dimensions'

interface Props {
	listing: Listing
}

export default function ImageSlider({ listing }: Props) {
	const [index, setIndex] = React.useState(0)

	const carouselRef = useRef(null)

	const SLIDER_CONTAINER: ViewStyle = { position: 'relative' }

	const PAGINATION_CONTAINER: ViewStyle = { position: 'absolute', bottom: 0, left: 0, right: 0 }

	const PAGINATION_DOTS: ViewStyle = {
		width: 10,
		height: 10,
		borderRadius: 5,
		marginHorizontal: 0,
		backgroundColor: 'rgba(256, 256, 256, 0.92)'
	}

	const SOLD_STATUS_CONTAINER: ViewStyle = { position: 'absolute', top: '50%', backgroundColor: 'rgba(0,0,0,0.65)', padding: 16, width: '100%', marginTop: -15 }
	const SOLD_STATUS_TEXT_TOP: TextStyle = { color: '#fff', fontSize: 22, textAlign: 'center', fontWeight: '500', marginBottom: 5 }
	const SOLD_STATUS_TEXT_BOTTOM: TextStyle = { color: '#fff', fontSize: 16, textAlign: 'center' }

	return (
		<View style={SLIDER_CONTAINER}>
			<Carousel
				layout="default"
				loop
				ref={carouselRef}
				onSnapToItem={(index) => setIndex(index)}
				data={listing.images}
				renderItem={CarouselCardItem}
				sliderWidth={screenWidth}
				itemWidth={screenWidth}
				inactiveSlideScale={1}
			/>
			<View style={PAGINATION_CONTAINER}>
				<Pagination dotsLength={listing.images.length} activeDotIndex={index} dotStyle={PAGINATION_DOTS} inactiveDotOpacity={0.4} inactiveDotScale={0.6} />
			</View>
			{listing.status === 'sold' && listing.sold_at && (
				<View style={SOLD_STATUS_CONTAINER}>
					<Text style={SOLD_STATUS_TEXT_TOP}>SOLD {formatDistanceToNow(new Date(listing.sold_at))} ago</Text>
					<Text style={SOLD_STATUS_TEXT_BOTTOM}>Scroll down to see similar items</Text>
				</View>
			)}
		</View>
	)
}

const CarouselCardItem = ({ item: url }) => {
	const CONTAINER: ViewStyle = { position: 'relative' }
	return (
		<View key={url} style={CONTAINER}>
			<Image source={{ uri: url, cache: 'force-cache' }} style={{ height: screenWidth }} />
		</View>
	)
}
