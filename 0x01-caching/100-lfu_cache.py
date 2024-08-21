#!/usr/bin/python3
""" LFUCache
"""

from base_caching import BaseCaching
from collections import defaultdict, OrderedDict


class LFUCache(BaseCaching):
    """ LFUCache inherits from BaseCaching and is a LFU caching system
    """

    def __init__(self):
        """ Initialize the class
        """
        super().__init__()
        self.freq = defaultdict(int)  # Tracks the frequency of access
        self.freq_list = defaultdict(OrderedDict)
        # Maps frequencies to OrderedDicts of keys
        self.min_freq = 0  # Keeps track of the minimum frequency

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key is None or item is None:
            return

        if key in self.cache_data:
            # Update the value of the key and increase its frequency
            self.cache_data[key] = item
            self._increase_frequency(key)
        else:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                # Evict the least frequently used item
                self._evict_least_frequently_used()

            # Insert the new key-value pair
            self.cache_data[key] = item
            self.freq[key] = 1
            self.freq_list[1][key] = None
            self.min_freq = 1  # Reset the min_freq to 1 for the new item

    def get(self, key):
        """ Get an item by key
        """
        if key is None or key not in self.cache_data:
            return None

        # Increase the frequency of the key and return its value
        self._increase_frequency(key)
        return self.cache_data[key]

    def _increase_frequency(self, key):
        """ Increase the frequency of a key
        """
        freq = self.freq[key]
        # Remove the key from the current frequency list
        del self.freq_list[freq][key]

        # If the current list is empty&minimum frequency, update min_freq
        if not self.freq_list[freq]:
            if self.min_freq == freq:
                self.min_freq += 1
            del self.freq_list[freq]

        # Update frequency and move the key to the new frequency list
        self.freq[key] = freq + 1
        self.freq_list[freq + 1][key] = None

    def _evict_least_frequently_used(self):
        """ Evict the least frequently used item
        """
        # Evict the first item in the min_freq list
        least_key, _ = self.freq_list[self.min_freq].popitem(last=False)

        # Remove the least frequently used item from cache_data and freq
        del self.cache_data[least_key]
        del self.freq[least_key]

        print("DISCARD:", least_key)
