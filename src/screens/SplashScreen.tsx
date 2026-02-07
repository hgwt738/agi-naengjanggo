import React, {useEffect, useRef} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import BootSplash from 'react-native-bootsplash';

const {width} = Dimensions.get('window');

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  // 애니메이션 값들
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // 네이티브 스플래시 숨기기
    BootSplash.hide({fade: true});

    // 로고 페이드인 + 스케일 애니메이션
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 텍스트 페이드인 (약간 딜레이)
    setTimeout(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 400);

    // 점 애니메이션 (순차적으로 반짝임)
    const dotAnimation = () => {
      const animateDot = (
        dot: Animated.Value,
        delay: number,
      ): Animated.CompositeAnimation => {
        return Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]);
      };

      Animated.loop(
        Animated.parallel([
          animateDot(dot1Opacity, 0),
          animateDot(dot2Opacity, 200),
          animateDot(dot3Opacity, 400),
        ]),
      ).start();
    };

    setTimeout(dotAnimation, 600);

    // 2.5초 후 홈 화면으로 이동
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [
    navigation,
    logoOpacity,
    logoScale,
    textOpacity,
    dot1Opacity,
    dot2Opacity,
    dot3Opacity,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{scale: logoScale}],
            },
          ]}>
          <Image
            source={require('../assets/loading.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={[styles.textContainer, {opacity: textOpacity}]}>
          <Text style={styles.title}>아기 냉장고</Text>
          <Text style={styles.subtitle}>우리 아이를 위한 건강한 레시피</Text>
        </Animated.View>
      </View>

      <View style={styles.loadingContainer}>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, {opacity: dot1Opacity}]} />
          <Animated.View style={[styles.dot, {opacity: dot2Opacity}]} />
          <Animated.View style={[styles.dot, {opacity: dot3Opacity}]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
  },
  loadingContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
  },
});
