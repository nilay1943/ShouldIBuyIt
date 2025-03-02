import { useState } from 'react';
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
  Flex,
} from '@chakra-ui/react';
import { FaMoneyBillWave, FaShoppingCart, FaTag } from 'react-icons/fa';

export default function Home() {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/getAdvice', {
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

      const data = await res.json();
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
    <Box minH="100vh" bg={bgColor} py={10}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
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
          >
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>
                  <HStack spacing={2}>
                    <Icon as={FaMoneyBillWave} color={accentColor} />
                    <Text>Monthly Income</Text>
                  </HStack>
                </FormLabel>
                <NumberInput min={0}>
                  <NumberInputField
                    placeholder="What's your monthly income?"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
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
                <NumberInput min={0}>
                  <NumberInputField
                    placeholder="How much does it cost?"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
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
    </Box>
  );
} 