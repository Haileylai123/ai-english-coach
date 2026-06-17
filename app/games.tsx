import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function GamesScreen() {
  const router = useRouter();
  return (
    <View style={{flex:1,backgroundColor:'#fdf2ec',paddingTop:60,paddingHorizontal:20}}>
      <TouchableOpacity onPress={()=>router.back()}><Text style={{fontSize:15,color:'#e8927f',fontWeight:'700',marginBottom:16}}>← Back</Text></TouchableOpacity>
      <Text style={{fontSize:24,fontFamily:'Nunito_800ExtraBold',color:'#e8927f'}}>Games</Text>
      <Text style={{fontSize:13,color:'#b8a89a',marginTop:4,marginBottom:20}}>5 種遊戲 · 35 短劇 · 挑戰</Text>
      <View style={{backgroundColor:'#fff',borderRadius:18,padding:24,alignItems:'center'}}>
        <Text style={{fontSize:48}}>🎮</Text>
        <Text style={{fontSize:15,color:'#3d3028',fontWeight:'700',marginTop:12}}>Learning Center</Text>
        <Text style={{fontSize:13,color:'#7a6a5e',textAlign:'center',marginTop:8,lineHeight:20}}>
          Word Match · Fill Blank · Scramble{'\n'}
          Quick Fire · Skits{'\n'}
          完整功能即將推出
        </Text>
      </View>
    </View>
  );
}
