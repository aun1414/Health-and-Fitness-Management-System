import { Animated, FlatList, Dimensions, StyleSheet, Text, View, BackHandler, ImageBackground } from 'react-native';
import React, { useRef, useState } from 'react';
import FileSlide from './SlideItem';
import { useNavigation } from '@react-navigation/native';
import PaginationPatient from './PaginationPatient';

const { width } = Dimensions.get('window');

const SliderPatient = ({route}) => {
    const [index, setIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const Slides = route.params.Slides

    const navigation = useNavigation();

    React.useEffect(() => {
        //what to do on pressing back button
        const backAction = () => {
            navigation.goBack();
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [])

    const handleOnScroll = event => {
        Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: {
                            x: scrollX,
                        },
                    },
                },
            ],
            {
                useNativeDriver: false,
            },
        )(event);
    };

    const handleOnViewableItemsChanged = useRef(({ viewableItems }) => {
        // console.log('viewableItems', viewableItems);
        setIndex(viewableItems[0].index);
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderItem = ({ item }) => {
        return (
          <View style={{ width }}>
            <FileSlide item={item} />
          </View>
        );
      };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../../images/appBack.jpg')}
                 resizeMode="cover"
                 style={{ height: '100%' }}>
            <FlatList
                data={Slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={handleOnScroll}
                onViewableItemsChanged={handleOnViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
            <PaginationPatient data={Slides} scrollX={scrollX} index={index} />
            </ImageBackground>
        </View>
    );
};

export default SliderPatient;

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
});

// import { Animated, FlatList, StyleSheet, Text, View, ImageBackground, BackHandler } from 'react-native';
// import React, { useRef, useState } from 'react';
// import FileSlide from './SlideItem';
// import PaginationPatient from './PaginationPatient';
// import { useNavigation } from '@react-navigation/native';

// const SliderPatient = ({ route }) => {

//     const Slides = route.params.Slides

//     const navigation = useNavigation();

//     React.useEffect(() => {
//         //what to do on pressing back button
//         const backAction = () => {
//           navigation.goBack();
//           return true;
//         };
//         const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
//         return () => backHandler.remove();
//       }, [])

//     return (
//         <View style={styles.container}>
//             <ImageBackground
//                 source={require('../../../images/appBack.jpg')}
//                  resizeMode="cover"
//                  style={{ height: '100%' }}>
//             <FlatList
//                 data={Slides}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 keyExtractor={(item) => item.hash}
//                 renderItem={({ item }) => <FileSlide item={item} />}
//                 contentContainerStyle={styles.flatListContentContainer}
//             />
//             </ImageBackground>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     item: {
//         width: '100%',
//         height: '100%',
//         backgroundColor: 'lightblue',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     title: {
//         fontSize: 20,
//         color: 'white',
//     },
//     flatListContentContainer: {
//         paddingHorizontal: 16,
//     },
// });

// export default SliderPatient;