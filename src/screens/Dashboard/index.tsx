import React from "react"
import { useCallback, useEffect, useRef } from "react"
import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from "react-native"
import Rive, { Alignment, type RiveRef } from "rive-react-native"
import Slider from "rn-range-slider"
import { GradientBorderView } from "@good-react-native/gradient-border"

import BackImage from "../../../src/assets/background.png"
import { Radar, Thumb } from "../../../src/assets"
import { GapView, MyInput } from "../../../src/components"

const resourceName = "wheel_dash"

function Dashboard(): React.JSX.Element {
  const riveRef = useRef<RiveRef>(null)

  const getGaugeValues = useCallback(() => {
    const rpm = Math.random() * 40
    const cool = Math.random() * 30
    const Fuel = Math.random() * 50
    const Oil = Math.random() * 50

    // Store interval ID so we can clear it later
    const intervalId = setInterval(() => {
      const RpmVal = Math.random() * rpm
      const CoolVal = Math.random() * cool
      const FuelVal = Math.random() * Fuel
      const OilVal = Math.random() * Oil

      console.log("RPM", ((RpmVal / 8) * 1000).toFixed(1))
      console.log("Coolant", (CoolVal * 5).toFixed(0))
      console.log("Fuel", (FuelVal * 2).toFixed(0))
      console.log("Oil", (OilVal / 5).toFixed(0))

      if (riveRef.current) {
        riveRef.current.setTextRunValue("RpmVal", ((RpmVal / 8) * 1000).toFixed(1))
        riveRef.current.setTextRunValue("CoolVal", (CoolVal * 5).toFixed(0))
        riveRef.current.setTextRunValue("FuelVal", (FuelVal * 2).toFixed(0))
        riveRef.current.setTextRunValue("OilVal", (OilVal / 5).toFixed(0))
        riveRef.current.setInputState("State Machine 1", "ERPMs", Number(RpmVal.toFixed(1)))
        riveRef.current.setInputState("State Machine 1", "CReads", Number(CoolVal.toFixed(0)))
        riveRef.current.setInputState("State Machine 1", "FReads", Number(FuelVal.toFixed(1)))
        riveRef.current.setInputState("State Machine 1", "OReads", Number(OilVal.toFixed(1)))
      }
    }, 1000)

    return intervalId
  }, [])

  useEffect(() => {
    const rpm = Math.random() * 100
    const Oil = Math.random() * 100

    if (riveRef.current) {
      riveRef.current.setInputState("State Machine 1", "ERPMs", rpm)
      riveRef.current.setInputState("State Machine 1", "OReads", Oil)
    }

    // Store the interval ID
    const intervalId = getGaugeValues()

    // Clean up the interval when component unmounts
    return () => {
      clearInterval(intervalId)
    }
  }, [getGaugeValues])

  const handleValueChange = useCallback((low: number, high: number, byUser: boolean) => {
    console.log("low", low)
    console.log("high", high)
  }, [])

  return (
    <View style={styles.container}>
      <ImageBackground source={BackImage} style={styles.backgroundImage} imageStyle={styles.backgroundImageStyle}>
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.contentContainer}>
            <Rive
              ref={riveRef}
              resourceName={resourceName}
              stateMachineName="State Machine 1"
              autoplay={true}
              alignment={Alignment.TopCenter}
              style={styles.riveAnimation}
            />
            <Radar style={styles.radarPosition} />

            <View style={styles.rightInputsContainer}>
              <MyInput label="HOURS" placeholder="hours" />
              <GapView />
              <MyInput label="ALTERNATOR" placeholder="V" />
              <GapView />
              <MyInput label="TRIM" placeholder="%" />
              <GapView />
              <MyInput label="ENG ECONOMY TOT" placeholder="nm/Ltr" />
              <GapView />
              <MyInput label="DEPTH" placeholder="m" />
            </View>

            <View style={styles.leftSliderContainer}>
              <Text style={styles.voltageLabel}>VOLTAGE</Text>
              <GapView />
              <View>
                <View style={styles.sliderTicksContainer}>
                  <View style={styles.sliderTick} />
                  <View style={styles.sliderTick} />
                  <View style={styles.sliderTick} />
                  <View style={styles.sliderTick} />
                  <View style={styles.sliderTick} />
                  <View style={styles.sliderTick} />
                  <View style={styles.sliderTick} />
                  <View style={styles.sliderTick} />
                </View>
                <Slider
                  min={0}
                  max={70}
                  step={10}
                  disableRange={true}
                  floatingLabel
                  renderThumb={() => <Thumb />}
                  renderRail={() => (
                    <View style={styles.sliderRail}>
                      <View style={styles.sliderRailBorder}>
                        <GradientBorderView
                          gradientProps={{
                            colors: ["#FFFFFF66", "#00000066"],
                            locations: [0.39, 1],
                          }}
                          style={styles.gradientBorder}
                        />
                      </View>
                    </View>
                  )}
                  renderRailSelected={() => (
                    <View style={styles.sliderRailSelected}>
                      <View style={styles.sliderRailSelectedInner} />
                    </View>
                  )}
                  onValueChanged={handleValueChange}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImageStyle: {
    opacity: 0.25,
    resizeMode: "cover",
  },
  safeAreaContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    position: "relative",
  },
  riveAnimation: {
    width: "100%",
    position: "relative",
  },
  radarPosition: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  rightInputsContainer: {
    position: "absolute",
    bottom: "5%",
    right: 10,
    width: "40%",
  },
  leftSliderContainer: {
    position: "absolute",
    bottom: "5%",
    left: 10,
    width: "40%",
  },
  voltageLabel: {
    textTransform: "uppercase",
    fontFamily: "InriaSans-Regular",
    color: "#FFFFFF66",
    fontSize: 16,
    marginLeft: 20,
  },
  sliderTicksContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    position: "absolute",
  },
  sliderTick: {
    height: 6,
    width: 3,
    backgroundColor: "#AFAFAF",
  },
  sliderRail: {
    flex: 1,
    height: 10,
  },
  sliderRailBorder: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  gradientBorder: {
    borderBottomWidth: 4,
  },
  sliderRailSelected: {
    height: 10,
  },
  sliderRailSelectedInner: {
    height: 6,
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "#fff",
  },
})

export default Dashboard

