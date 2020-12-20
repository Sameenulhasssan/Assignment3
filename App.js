import React , {useState, useEffect} from 'react';
import { StyleSheet, View, TextInput, Button, Text  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataTable} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'skyblue',
  },
  display: {
    flex: 1,
    justifyContent: "center"
  },
  input: {
    height: 20,
    padding: 10,
    marginBottom: 1,
    width: 150,
    fontSize: 18,
    color: 'black',
    backgroundColor: 'white'
  
  },
  text: {
    fontSize: 14,
    color: 'white',
    textAlign: "center",
    marginTop: 10,
  },
  results: {
    marginTop: 50
  },
  save: {
    marginTop: 15,
  

    
  },
});

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="My Calculator" component={Calculation}    options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            
          },
        }} />
    
        <Stack.Screen name="History" component={History} 
          options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Calculation = ({route, navigation}) => {
  const [originalPrice, setOriginalPrice] = useState("");
  const [DP, setDP] = useState("");
  const [History, setHistory] = useState([]);
  const [id, setId] = useState(1);

  const onChangeOriginalPrice = (text) => {
    setOriginalPrice(text);
  }

  const onChangeDiscountPerdentage = (text) => {
    setDP(text);
  }

  useEffect(() => {
    if (route.params?.history){
      setHistory(route.params.history);
      navigation.setParams({ history: undefined })
    }

  });


  let youSave ;
  let finalPrice ;
  let error = "" ;

  const calcDiscount = (text) => {
    const Price = eval(originalPrice);
    const Discount = eval(DP);
    if (originalPrice!=="" && DP!=="" && Discount<100){
      youSave = (Price/100 * Discount).toFixed(2);
      finalPrice = (Price - youSave).toFixed(2); 
    }
    else if (originalPrice!=="" && DP!==""){
      error = "Sorry! Try Again";
    }
    else{}
  }

  const saveCalculation = () => {
    setId(id+1);
    setHistory([{
      id: id,
      originalPrice: originalPrice,
      finalPrice: finalPrice,
      DP: DP
    }, ...History]);
    youSave=finalPrice=error="";
    onChangeDiscountPerdentage("");
    onChangeOriginalPrice("");
  }

  return(
      <View style={styles.container}>
      <View style={styles.display}>
        <TextInput 
        style={styles.input} placeholder = "Total Price"
        value={originalPrice}
        keyboardType='numeric'
        onChangeText={text => onChangeOriginalPrice(text)} />
        <TextInput 
        style={styles.input} placeholder = "Discount%"
        value={DP}
        keyboardType='numeric'
        onChangeText={text => onChangeDiscountPerdentage(text)} />
        {calcDiscount()}
        <View style={styles.results}>
          <Text style={styles.text}>{error}</Text>
    
        </View>
        <View>
          <Button  onPress={saveCalculation} style={styles.save} title="Save Calculation" />
          <View style={{marginTop: 10}}>
            <Button title="History"
                onPress={() => {
                  navigation.navigate('History', {
                  History: History
                  });
                }}
            />
          </View>
        </View>
      </View>
      </View> 
  );
}

const History = ({route, navigation}) => {
  const data = route.params.History;
  const [history, setHistory] = useState(data);

  const handleRemove = (id) => {
    const list = history.filter(item => item.id !== id)
    setHistory(list);
  }

  const clearHistory = () => {
    setHistory([])
  }

    navigation.setOptions({
      
      Top: () => (
            <Button title='Back'
              onPress={() => {
                navigation.navigate('Calculation', {
                history: history
                });
              }}
            />
      ),
    });

  return(
      <View style={styles.container}> 
      <DataTable >
        <DataTable.Header >
          <DataTable.Title >  Price </DataTable.Title>
          
          <DataTable.Title > Final Price </DataTable.Title>
          <DataTable.Title style={{marginRight: 10}} > Delete </DataTable.Title>
        </DataTable.Header>
        
        {history.map(mem => 
            <DataTable.Row key={mem.id}>
              <DataTable.Title > {mem.originalPrice} </DataTable.Title>
           
              <DataTable.Title > {mem.finalPrice} </DataTable.Title>
              <DataTable.Cell style={{marginRight: 20}}>
                <Text>
                  <Button onPress={() => handleRemove(mem.id)} title="Del" />
                </Text>
              </DataTable.Cell>

            </DataTable.Row>
        )}
      </DataTable>
      </View> 
  );
}