import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { DeviceMotion } from "expo-sensors";
import { useEffect } from "react";
import Animated, {
  withDecay,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const SIZE = 100;

export default function App() {
  const { width, height } = useWindowDimensions();
  const axis = useSharedValue({ x: 0, y: 0 });
  const onDeviceMotionChange = (event) => {
    const { x, y } = event.accelerationIncludingGravity;
    axis.value = {
      x: Math.round(x),
      y: Math.round(y),
    };
  };
  useEffect(() => {
    DeviceMotion.addListener(onDeviceMotionChange);
    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    console.log("value", axis.value.x);

    return {
      transform: [
        {
          translateX: withDecay({
            velocity: axis.value.x * 200,
            rubberBandEffect: true,
            clamp: [-(width / 2) + SIZE / 2, width / 2 - SIZE / 2],
          }),
        },
        {
          translateY: withDecay({
            velocity: -axis.value.y * 200,
            rubberBandEffect: true,
            clamp: [-(width / 2) + SIZE / 2, width / 2 - SIZE / 2],
          }),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, animatedStyle]} />
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    backgroundColor: "red",
    width: 100,
    height: 100,
  },
});
