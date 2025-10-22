import React, { useState, useMemo } from 'react';
import { Text, View, TextInput, Button, Alert, ScrollView } from 'react-native';

import { DishItem } from './types'; 
import styles from './styles'; 

// --- Types/Interfaces ---
interface MenuItem {
  name: string;
  description: string;
  course: 'Starter' | 'Main Meal' | 'Dessert' | 'Drink';
  price: number;
}
interface GroupedMenu {
  [key: string]: MenuItem[];
}

// --- MenuScreen Component Definition ---
const MenuScreen = () => { 
    // --- State Variables ---
    const [dishName, setDishName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [course, setCourse] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [menuItems, setMenus] = useState<MenuItem[]>([]);
    const [itemAdded, setItemAdded] = useState(false);
    const [items, setItems] = useState<DishItem[]>([]);
    const [chefMessage, setChefMessage] = useState('');

    // --- Functions ---
    const handleSave = () => {
        // Define valid course names for validation
        const validCourses = ['Starter', 'Main Meal', 'Dessert', 'Drink'];
        const trimmedCourse = course.trim();
        
        // Find the standardized course (e.g., converts 'main meal' to 'Main Meal')
        const standardizedCourse = validCourses.find(c => 
            c.toLowerCase() === trimmedCourse.toLowerCase()
        );

        if (!dishName || !description || !standardizedCourse || !price) {
            Alert.alert('Error', 'Please fill in all fields, including a valid Course (Starter, Main Meal, Dessert, or Drink).');
            return;
        }

        const priceNumber = parseFloat(price);

        const newItem: MenuItem = {
            name: dishName,
            description: description,
            // Use the standardized course name here to ensure grouping works
            course: standardizedCourse as 'Starter' | 'Main Meal' | 'Dessert' | 'Drink', 
            price: priceNumber,
        };

        // This updates the state and triggers the useMemo hook below
        setMenus((prevItems) => [...prevItems, newItem]);
        setDishName('');
        setDescription('');
        setCourse(''); // Clear the course input field
        setPrice('');
        setItemAdded(true);
        Alert.alert('Success', 'Menu item added successfully!');
    };
   

    // 🌟 FIX: Use useMemo to recalculate groupedMenu whenever menuItems changes
    const groupedMenu = useMemo(() => {
        const result: GroupedMenu = {
            Starter: [],
            'Main Meal': [],
            Dessert: [],
            Drink: [],
        };

        menuItems.forEach((item) => {
            // This condition is now guaranteed to pass if handleSave was successful
            if (result[item.course]) { 
                result[item.course].push(item);
            }
        });
        return result;
    }, [menuItems]); // 👈 This dependency array ensures recalculation on state change

    // --- Return JSX (Render) ---
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Christoffell's Kitchen</Text>
        <Text style={styles.subtitle}>The Best In Cape Town</Text>
        <Text style={styles.section}>MEAL OF THE DAY</Text>
        <Text style={styles.section}>Chef's Message</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Meal Of the Day!"
          value={chefMessage}
          onChangeText={setChefMessage}
        />
      
        <Text style={styles.section}>Add New Menu Item</Text>
      
        <Text style={styles.label}>Dish Name:</Text>
        <TextInput
          style={styles.input}
          value={dishName}
          onChangeText={setDishName}
          placeholder="Enter dish name"
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
        />
        
        {/* ADDED: Input for Course */}
        <Text style={styles.label}>Course:</Text>
        <TextInput
            style={styles.input}
            value={course}
            onChangeText={setCourse}
            placeholder="Starter, Main Meal, Dessert, Drink"
        />
    
        <Text style={styles.label}>Price:</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="numeric"
        />

        <Button title="Save Dish" onPress={handleSave}/>
          {itemAdded && <Text style={styles.success}>Menu Item Added Successfully!</Text>}
          
          {/* NOW CORRECTLY UPDATING DISH COUNT */}
       <Text style={styles.section}>Total Dishes: {menuItems.length}</Text> 
       <Text style={styles.section}>Menu Preview</Text>

       {chefMessage ? (
          <Text style={styles.chefNote}>Chef says: {chefMessage}</Text>
       ) : null}

       {Object.entries(groupedMenu).map(([category, items]) => (
        <View key={category} style={styles.menuSection}>
          <Text style={styles.category}>{category} ({items.length})</Text>
          {items.length === 0 ? (
            <Text style={styles.empty}>No items yet.</Text>
          ) : (
            
            items.map((item, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <Text style={styles.cardDesc}>Course: {item.course}</Text>
                <Text style={styles.cardPrice}>
                  R {item.price}
                  </Text> 
              </View>
            ))
          )}
        </View>
      ))}
      </ScrollView>
    );
};

export default MenuScreen;