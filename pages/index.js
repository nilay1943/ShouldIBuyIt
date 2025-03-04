import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Heading,
  useColorModeValue,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FaMoneyBillWave, FaShoppingCart, FaTag } from 'react-icons/fa';

const createNewBag = (bagCount) => {
  const layer = Math.floor(Math.random() * 3);
  return {
    id: Date.now() + bagCount,
    side: Math.random() > 0.5 ? 'left' : 'right',
    top: 200 + (bagCount * 10),
    offset: 20 + Math.random() * 80,
    rotation: Math.random() * 40 - 20,
    entranceDelay: 0,
    zIndex: 10 + layer * 5,
    scale: 1 + (layer * 0.1),
    opacity: 1
  };
};

const MoneyPileVisualizer = ({ monthlyIncome, itemPrice }) => {
  const [bagPositions, setBagPositions] = useState([]);
  const [burningBags, setBurningBags] = useState(new Set());
  const [flames, setFlames] = useState(new Map());
  const [poofBags, setPoofBags] = useState(new Map());
  const [hiddenBags, setHiddenBags] = useState(new Set());
  
  // Calculate number of bags based on remaining spendable income
  const calculateBags = (income, price = 0) => {
    const numericIncome = parseFloat(income) || 0;
    const numericPrice = parseFloat(price) || 0;
    
    if (numericIncome <= 0) return 0;
    
    // Calculate the base number of bags from income using log base 4
    const baseBags = Math.floor(Math.log(numericIncome) / Math.log(4) * 2);
    
    // Calculate the reduction factor based on price/income ratio
    const reductionFactor = Math.max(0, 1 - (numericPrice / numericIncome));
    
    // Return the adjusted number of bags
    return Math.max(0, Math.floor(baseBags * reductionFactor));
  };

  useEffect(() => {
    const currentIncome = parseFloat(monthlyIncome) || 0;
    const currentPrice = parseFloat(itemPrice) || 0;
    
    const targetBagCount = calculateBags(currentIncome, currentPrice);
    const visibleBags = bagPositions.filter(bag => bag.opacity !== 0);
    const visibleBagCount = visibleBags.length;

    console.log('Target bags:', targetBagCount, 'Visible bags:', visibleBagCount);
    
    // Always adjust the number of bags to match the target
    if (targetBagCount < visibleBagCount) {
      // Need to burn away excess bags
      const bagsToRemove = visibleBagCount - targetBagCount;
      
      // Start all bags burning simultaneously
      visibleBags.slice(-bagsToRemove).forEach(bag => {
        setBurningBags(prev => new Set([...prev, bag.id]));
        setFlames(prev => {
          const next = new Map(prev);
          next.set(bag.id, true);
          return next;
        });
        
        setTimeout(() => {
          setBagPositions(prev => prev.map(b => 
            b.id === bag.id ? { ...b, opacity: 0 } : b
          ));
          setHiddenBags(prev => new Set([...prev, bag.id]));
          setBurningBags(prev => {
            const next = new Set(prev);
            next.delete(bag.id);
            return next;
          });
          setFlames(prev => {
            const next = new Map(prev);
            next.delete(bag.id);
            return next;
          });
        }, 1000);
      });
    } else if (targetBagCount > visibleBagCount) {
      // Need to add more bags
      const bagsToAdd = targetBagCount - visibleBagCount;
      
      // First try to reuse hidden bags
      const hiddenBagsArray = Array.from(hiddenBags);
      const bagsToReuse = hiddenBagsArray.slice(0, Math.min(bagsToAdd, hiddenBagsArray.length));
      const remainingBagsToAdd = bagsToAdd - bagsToReuse.length;

      // Reuse hidden bags all at once
      if (bagsToReuse.length > 0) {
        setBagPositions(prev => prev.map(bag => 
          bagsToReuse.includes(bag.id) ? { ...bag, opacity: 1 } : bag
        ));
        setHiddenBags(prev => {
          const next = new Set(prev);
          bagsToReuse.forEach(id => next.delete(id));
          return next;
        });
        bagsToReuse.forEach(id => {
          setPoofBags(prev => {
            const next = new Map(prev);
            next.set(id, { type: 'in', timestamp: Date.now() });
            return next;
          });
        });
      }

      // Create new bags if needed
      if (remainingBagsToAdd > 0) {
        const newBags = Array(remainingBagsToAdd).fill(null)
          .map((_, index) => createNewBag(bagPositions.length + index));
        setBagPositions(prev => [...prev, ...newBags]);
        newBags.forEach(bag => {
          setPoofBags(prev => {
            const next = new Map(prev);
            next.set(bag.id, { type: 'in', timestamp: Date.now() });
            return next;
          });
        });
      }

      setTimeout(() => {
        setPoofBags(new Map());
      }, 250);
    }
  }, [monthlyIncome, itemPrice, bagPositions]);

  return (
    <>
      <style jsx global>{`
        @keyframes burn {
          0% {
            filter: brightness(100%);
            transform: rotate(var(--rotation)) scale(var(--scale));
          }
          20% {
            filter: brightness(140%) sepia(50%) saturate(150%) hue-rotate(300deg);
            transform: rotate(calc(var(--rotation) - 3deg)) scale(calc(var(--scale) * 1.1)) translateY(-10px);
          }
          40% {
            filter: brightness(160%) sepia(70%) saturate(200%) hue-rotate(320deg);
            transform: rotate(calc(var(--rotation) + 3deg)) scale(calc(var(--scale) * 1.15)) translateY(-15px);
          }
          60% {
            filter: brightness(150%) sepia(90%) saturate(250%) hue-rotate(340deg);
            transform: rotate(calc(var(--rotation) - 2deg)) scale(calc(var(--scale) * 1.1)) translateY(-20px);
          }
          80% {
            filter: brightness(130%) sepia(100%) saturate(300%) hue-rotate(350deg);
            transform: rotate(calc(var(--rotation) + 2deg)) scale(calc(var(--scale) * 0.8)) translateY(-25px);
            opacity: 0.5;
          }
          100% {
            filter: brightness(50%) sepia(100%) saturate(200%) hue-rotate(360deg);
            transform: rotate(calc(var(--rotation) + 5deg)) scale(0) translateY(-30px);
            opacity: 0;
          }
        }

        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          25% { transform: scale(1.1) rotate(5deg); opacity: 1; }
          50% { transform: scale(0.9) rotate(-5deg); opacity: 0.8; }
          75% { transform: scale(1.2) rotate(3deg); opacity: 1; }
        }

        @keyframes poofIn {
          0% {
            opacity: 0;
            transform: scale(0) rotate(var(--rotation));
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2) rotate(var(--rotation));
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(var(--rotation));
          }
        }
      `}</style>
      <Box 
        position="fixed" 
        top="0"
        left="0" 
        right="0" 
        height="100vh"
        zIndex={1}
        pointerEvents="none"
        bg="transparent"
      >
        <Box 
          position="relative" 
          height="100%" 
          maxWidth="container.md" 
          margin="0 auto"
          overflow="visible"
        >
          {bagPositions.map((pos) => (
            <Box key={pos.id} position="relative" style={{ display: pos.opacity === 0 ? 'none' : 'block' }}>
              <Text 
                fontSize="40px"
                position="absolute"
                top={`${pos.top}px`}
                {...(pos.side === 'left' 
                  ? { left: `${-pos.offset}px` }
                  : { right: `${-pos.offset}px` }
                )}
                style={{
                  '--rotation': `${pos.rotation}deg`,
                  '--scale': pos.scale,
                  filter: `brightness(${100 - Math.floor(bagPositions.indexOf(pos) / 6) * 2}%)`,
                  textShadow: '2px 2px 3px rgba(0,0,0,0.2)',
                  animation: burningBags.has(pos.id)
                    ? 'burn 1.5s ease-in-out forwards'
                    : poofBags.has(pos.id) ? 'poofIn 1s ease-in-out forwards' : 'none',
                  opacity: pos.opacity,
                  transform: `rotate(${pos.rotation}deg) scale(${pos.scale})`,
                  zIndex: pos.zIndex
                }}
              >
                💰
              </Text>
              {flames.has(pos.id) && (
                <>
                  <Text
                    fontSize="45px"
                    position="absolute"
                    top={`${pos.top - 20}px`}
                    {...(pos.side === 'left' 
                      ? { left: `${-pos.offset - 5}px` }
                      : { right: `${-pos.offset - 5}px` }
                    )}
                    style={{
                      animation: 'flicker 0.5s ease-in-out infinite',
                      zIndex: pos.zIndex + 1
                    }}
                  >
                    🔥
                  </Text>
                  <Text
                    fontSize="35px"
                    position="absolute"
                    top={`${pos.top - 15}px`}
                    {...(pos.side === 'left' 
                      ? { left: `${-pos.offset + 15}px` }
                      : { right: `${-pos.offset + 15}px` }
                    )}
                    style={{
                      animation: 'flicker 0.6s ease-in-out infinite',
                      zIndex: pos.zIndex + 1
                    }}
                  >
                    🔥
                  </Text>
                </>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default function Home() {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const responseRef = useRef(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  const scrollToResponse = useCallback(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  useEffect(() => {
    if (response) {
      scrollToResponse();
    }
  }, [response, scrollToResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://finance-helper-api.should-i-buy-it.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthlyIncome,
          itemName,
          itemPrice,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get advice');
      }

      setResponse(data.message);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get advice. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box minH="100vh" bg={bgColor} py={10} position="relative">
        <Container maxW="container.md" position="relative" zIndex={2}>
          <VStack spacing={4} align="stretch">
            <Box textAlign="center">
              <Heading 
                as="h1" 
                size="2xl" 
                bgGradient="linear(to-r, blue.400, purple.500)" 
                bgClip="text"
                mb={2}
              >
                Should I Buy It? 🤔
              </Heading>
              <Text color="gray.500" fontSize="lg">
                Get financial advice for your shopping decisions
              </Text>
            </Box>
            
            <Box
              as="form"
              onSubmit={handleSubmit}
              bg={cardBg}
              p={8}
              borderRadius="xl"
              boxShadow="lg"
              border="1px"
              borderColor={borderColor}
              position="relative"
              mb={4}
            >
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>
                    <HStack spacing={2}>
                      <Icon as={FaMoneyBillWave} color={accentColor} />
                      <Text>Monthly Income</Text>
                    </HStack>
                  </FormLabel>
                  <NumberInput 
                    min={0}
                    value={monthlyIncome}
                    onChange={(valueString) => setMonthlyIncome(valueString)}
                    format={value => `$${value}`}
                    parse={value => value.replace(/^\$/, '')}
                  >
                    <NumberInputField
                      placeholder="What's your monthly income?"
                      bg={useColorModeValue('white', 'gray.700')}
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: 'outline',
                      }}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>
                    <HStack spacing={2}>
                      <Icon as={FaShoppingCart} color={accentColor} />
                      <Text>Item Name</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    placeholder="What do you want to buy?"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    bg={useColorModeValue('white', 'gray.700')}
                    _focus={{
                      borderColor: accentColor,
                      boxShadow: 'outline',
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>
                    <HStack spacing={2}>
                      <Icon as={FaTag} color={accentColor} />
                      <Text>Item Price</Text>
                    </HStack>
                  </FormLabel>
                  <NumberInput 
                    min={0}
                    value={itemPrice}
                    onChange={(valueString) => setItemPrice(valueString)}
                    format={value => `$${value}`}
                    parse={value => value.replace(/^\$/, '')}
                  >
                    <NumberInputField
                      placeholder="How much does it cost?"
                      bg={useColorModeValue('white', 'gray.700')}
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: 'outline',
                      }}
                    />
                  </NumberInput>
                </FormControl>

                <Button
                  type="submit"
                  size="lg"
                  width="full"
                  colorScheme="blue"
                  isLoading={loading}
                  loadingText="Getting Advice..."
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  _hover={{
                    bgGradient: "linear(to-r, blue.500, purple.600)",
                  }}
                  _active={{
                    bgGradient: "linear(to-r, blue.600, purple.700)",
                  }}
                >
                  Get Advice
                </Button>
              </VStack>
            </Box>

            {response && (
              <Box
                ref={responseRef}
                p={8}
                borderRadius="xl"
                bg={cardBg}
                boxShadow="lg"
                border="1px"
                borderColor={borderColor}
                position="relative"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  borderWidth: "12px",
                  borderStyle: "solid",
                  borderColor: `transparent transparent ${borderColor} transparent`,
                }}
              >
                <Text 
                  fontSize="xl" 
                  lineHeight="tall"
                  color={useColorModeValue('gray.700', 'gray.200')}
                >
                  {response}
                </Text>
              </Box>
            )}
          </VStack>
        </Container>
        <MoneyPileVisualizer monthlyIncome={monthlyIncome} itemPrice={itemPrice} />
      </Box>
    </>
  );
} 