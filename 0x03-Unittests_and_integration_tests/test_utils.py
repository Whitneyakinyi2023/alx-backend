#!/usr/bin/env python3
"""test_utils.py"""


import unittest
from parameterized import parameterized
from utils import access_nested_map


class TestAccessNestedMap(unittest.TestCase):
    """Test cases for the access_nested_map function."""

    @parameterized.expand([
        # Test accessing a top-level key
        ({"a": 1}, ("a",), 1),
        # Test accessing a nested dictionary
        ({"a": {"b": 2}}, ("a",), {"b": 2}),
        # Test accessing a value inside a nested dictionary
        ({"a": {"b": 2}}, ("a", "b"), 2),
    ])
    def test_access_nested_map(self, nested_map, path, expected):
        """Test that access_nested_map
        returns the correct value for valid paths."""
        self.assertEqual(access_nested_map(nested_map, path), expected)
