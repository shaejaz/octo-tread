import React from 'react'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'

export function Toolbar (): JSX.Element {
  return (
    <Box>
        <Flex bg={'gray.400'}>
            <Flex flex={1} justify={'space-between'} align={'center'} px={8} py={4}>
                <Heading as={'h3'} fontSize={'2xl'}>
                    Octotread
                </Heading>

                <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                    <Text>
                        Navbar
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    </Box>
  )
}
