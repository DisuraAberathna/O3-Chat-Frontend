import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import PrimaryHeader from '@/components/PrimaryHeader';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import icons from '@/constants/icons';

const LIGHT_COLORS = [
    { id: 'default', color: 'transparent', label: 'Default' },
    { id: 'soft-blue', color: '#e0f2fe', label: 'Soft Blue' },
    { id: 'soft-green', color: '#dcfce7', label: 'Soft Green' },
    { id: 'soft-rose', color: '#ffe4e6', label: 'Soft Rose' },
    { id: 'soft-amber', color: '#fef3c7', label: 'Soft Amber' },
    { id: 'classic-whatsapp', color: '#ece5dd', label: 'Classic' },
];

const DARK_COLORS = [
    { id: 'default', color: 'transparent', label: 'Default' },
    { id: 'dark-grey', color: '#1f2937', label: 'Dark Grey' },
    { id: 'dark-blue', color: '#1e3a8a', label: 'Deep Blue' },
    { id: 'dark-green', color: '#064e3b', label: 'Deep Green' },
    { id: 'dark-purple', color: '#4c1d95', label: 'Deep Purple' },
    { id: 'dark-charcoal', color: '#111827', label: 'Charcoal' },
];

const Wallpaper = () => {
    const colorScheme = useColorScheme();
    const [lightSelected, setLightSelected] = useState('default');
    const [darkSelected, setDarkSelected] = useState('default');

    useEffect(() => {
        const loadWallpaper = async () => {
            const savedLight = await AsyncStorage.getItem('chat_wallpaper_light');
            const savedDark = await AsyncStorage.getItem('chat_wallpaper_dark');
            if (savedLight) setLightSelected(savedLight);
            if (savedDark) setDarkSelected(savedDark);
        };
        loadWallpaper();
    }, []);

    const saveLightWallpaper = async (id) => {
        setLightSelected(id);
        await AsyncStorage.setItem('chat_wallpaper_light', id);
    };

    const saveDarkWallpaper = async (id) => {
        setDarkSelected(id);
        await AsyncStorage.setItem('chat_wallpaper_dark', id);
    };

    const getPreviewColor = () => {
        if (colorScheme === 'dark') {
            const selected = DARK_COLORS.find(c => c.id === darkSelected);
            if (darkSelected === 'default') return '#111827';
            return selected.color;
        } else {
            const selected = LIGHT_COLORS.find(c => c.id === lightSelected);
            if (lightSelected === 'default') return '#e2e8f0';
            return selected.color;
        }
    };

    const ColorList = ({ data, selectedId, onSelect, title }) => (
        <View style={{ marginBottom: 24 }}>
            <Text style={[styles.sectionTitle, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>{title}</Text>
            <View style={[styles.card, colorScheme === 'dark' ? styles.darkView : styles.lightView]}>
                <FlatList
                    data={data}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.colorOption,
                                { backgroundColor: item.id === 'default' ? (title.includes('Dark') ? '#374151' : '#d1d5db') : item.color },
                                selectedId === item.id && styles.selectedOption
                            ]}
                            onPress={() => onSelect(item.id)}
                        >
                            {selectedId === item.id && (
                                <Image
                                    source={icons.plus}
                                    style={{ width: 20, height: 20, tintColor: '#0c4eac', transform: [{ rotate: '45deg' }] }}
                                />
                            )}
                        </TouchableOpacity>
                    )}
                />
                <Text style={[styles.selectedLabel, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                    {data.find(c => c.id === selectedId)?.label}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            style={[styles.container, colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer]}
        >
            <PrimaryHeader
                title="Chat Wallpaper"
                menu={false}
                back={true}
                backPress={() => router.back()}
            />

            <View
                style={[
                    { flex: 1 },
                    colorScheme === "dark"
                        ? styles.darkContentView
                        : styles.lightContentView,
                ]}
            >
                <ScrollView contentContainerStyle={styles.content}>

                    <Text style={[styles.sectionTitle, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>Preview ({colorScheme === 'dark' ? 'Dark' : 'Light'})</Text>
                    <View style={[styles.previewContainer, { backgroundColor: getPreviewColor() }]}>
                        <View style={[styles.bubble, styles.bubbleLeft, { backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#fff' }]}>
                            <Text style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}>This is how your chat will look!</Text>
                        </View>
                        <View style={[styles.bubble, styles.bubbleRight, { backgroundColor: '#0c4eac' }]}>
                            <Text style={{ color: '#fff' }}>I love individual theme wallpapers.</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 24 }}>
                        <ColorList
                            title="Light Theme Wallpaper"
                            data={LIGHT_COLORS}
                            selectedId={lightSelected}
                            onSelect={saveLightWallpaper}
                        />
                        <ColorList
                            title="Dark Theme Wallpaper"
                            data={DARK_COLORS}
                            selectedId={darkSelected}
                            onSelect={saveDarkWallpaper}
                        />
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    darkContainer: {
        backgroundColor: '#000',
    },
    lightContainer: {
        backgroundColor: '#fff',
    },
    darkContentView: {
        backgroundColor: "#111827",
    },
    lightContentView: {
        backgroundColor: "#e2e8f0",
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 12,
        color: "#0c4eac",
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    previewContainer: {
        height: 200,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(150, 150, 150, 0.2)',
    },
    bubble: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        maxWidth: '80%',
    },
    bubbleLeft: {
        alignSelf: 'flex-start',
        borderTopLeftRadius: 0,
    },
    bubbleRight: {
        alignSelf: 'flex-end',
        borderTopRightRadius: 0,
    },
    card: {
        padding: 16,
        borderRadius: 16,
        elevation: 2,
    },
    darkView: {
        backgroundColor: "#000",
    },
    lightView: {
        backgroundColor: "#fff",
    },
    colorOption: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        marginRight: 12,
        borderWidth: 2,
        borderColor: 'rgba(150, 150, 150, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedOption: {
        borderColor: '#0c4eac',
        borderWidth: 3,
    },
    selectedLabel: {
        marginTop: 12,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 13,
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#000',
    },
});

export default Wallpaper;
