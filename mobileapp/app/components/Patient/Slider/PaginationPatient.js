import {StyleSheet, Animated, View, Dimensions} from 'react-native';
import React from 'react';

const {width} = Dimensions.get('screen');

const PaginationPatient = ({data, scrollX}) => {
  return (
    <View style={styles.container}>
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [12, 30, 12],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.2, 1, 0.1],
          extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['skyblue', 'blue', 'skyblue'],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={idx.hash}
            style={[
              styles.dot,
              {width: dotWidth, backgroundColor},
              // idx === index && styles.dotActive,
            ]}
          />
        );
      })}
    </View>
  );
};

export default PaginationPatient;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 35,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 3,
    backgroundColor: 'skyblue',
  },
  dotActive: {
    backgroundColor: 'blue',
  },
});