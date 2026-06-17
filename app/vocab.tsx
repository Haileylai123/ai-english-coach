import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function VocabScreen() {
  const router = useRouter();
  return (
    <View style={{flex:1,backgroundColor:'#fdf2ec',paddingTop:60,paddingHorizontal:20}}>
      <TouchableOpacity onPress={()=>router.back()}><Text style={{fontSize:15,color:'#e8927f',fontWeight:'700',marginBottom:16}}>← Back</Text></TouchableOpacity>
      <Text style={{fontSize:24,fontFamily:'Nunito_800ExtraBold',color:'#e8927f'}}>Vocabulary</Text>
      <Text style={{fontSize:13,color:'#b8a89a',marginTop:4,marginBottom:20}}>單詞庫 · SRS 複習 · 字典</Text>
      <View style={{backgroundColor:'#fff',borderRadius:18,padding:24,alignItems:'center'}}>
        <Text style={{fontSize:48}}>📚</Text>
        <Text style={{fontSize:15,color:'#3d3028',fontWeight:'700',marginTop:12}}>Vocab · 單詞庫</Text>
        <Text style={{fontSize:13,color:'#7a6a5e',textAlign:'center',marginTop:8,lineHeight:20}}>
          加入生字 · SRS 智能複習 · 字典查詢{'\n'}
          完整功能即將推出
        </Text>
      </View>
    </View>
  );
}
