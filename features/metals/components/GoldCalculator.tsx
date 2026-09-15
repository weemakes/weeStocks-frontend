import { SmartMetalCalculator } from './SmartMetalCalculator';
export function GoldCalculator({prices}:{prices:{'24K':number;'22K':number;'18K':number}}){return <SmartMetalCalculator metal="gold" cityName="" prices={prices}/>;}
