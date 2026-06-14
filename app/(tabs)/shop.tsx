import { View, Text, StyleSheet } from 'react-native';

export default function ShopScreen() {
  return (
    <View style={s.container}>
      <Text style={s.title}>🛍️ Shop</Text>
      <Text style={s.sub}>Outfits · Furniture · Backgrounds</Text>
    </View>
  );
}
const s = StyleSheet.create({ container:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#fff8f4'}, title:{fontSize:24,fontWeight:'700',color:'#3d3028'}, sub:{fontSize:14,color:'#8b7a6e',marginTop:8} });
